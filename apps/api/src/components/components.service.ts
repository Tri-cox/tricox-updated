import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ComponentsService {
    constructor(private prisma: PrismaService) { }

    async ship(userArgs: any, file: Express.Multer.File, metadata: any) {
        const { name, org, dependencies, isPublic } = metadata;

        // Ensure mock user exists for demo FK constraints
        let user = await this.prisma.user.findFirst({ where: { email: userArgs.email } });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    id: userArgs.id,
                    email: userArgs.email,
                    passwordHash: 'mock'
                }
            });
        }

        // 1. Find or create Organization
        // Assume org exists or create it if user owns it? 
        // For demo, we just look up the org.
        // 1. Find or create Organization
        let organization = await this.prisma.organization.findUnique({ where: { name: org } });

        if (organization) {
            // Verify ownership
            if (organization.ownerId !== user.id) {
                // In a real app we might check permissions table.
                // For now, strict ownership.
                throw new ForbiddenException(`You do not have permission to ship to organization '${org}'. Please switch to your own organization using 'tricox switch <your-org>'.`);
            }
        } else {
            // Create if not exists (owned by user)
            organization = await this.prisma.organization.create({
                data: { name: org, ownerId: user.id }
            });
        }

        // 2. Find or create Component
        let component = await this.prisma.component.findUnique({
            where: { orgId_name: { orgId: organization.id, name } }
        });

        if (!component) {
            component = await this.prisma.component.create({
                data: {
                    name,
                    orgId: organization.id,
                    isPublic: isPublic === 'true'
                }
            });
        }

        // 3. Create Version
        // Auto-increment version logic is complex, simplify to "1.0.0" or timestamp based for demo
        const versionString = `1.0.${Date.now()}`;

        // Mock S3 upload: encode file buffer to base64 to store in DB for demo (NOT RECCOMENDED FOR PROD)
        // Or just store text content if it's source code
        const fileContent = file.buffer.toString('utf-8');

        await this.prisma.version.create({
            data: {
                componentId: component.id,
                version: versionString,
                s3Key: fileContent, // Storing content directly in s3Key field for demo simplicity (SQLite)
                metadata: JSON.stringify({ dependencies }),
            }
        });

        return { success: true, message: `Shipped ${org}/${name}@${versionString}` };
    }

    async dock(orgName: string, componentName: string, version?: string) {
        const org = await this.prisma.organization.findUnique({ where: { name: orgName } });
        if (!org) throw new NotFoundException('Org not found');

        const component = await this.prisma.component.findUnique({
            where: { orgId_name: { orgId: org.id, name: componentName } }
        });
        if (!component) throw new NotFoundException('Component not found');

        // Get latest version if not specified
        const versionRecord = await this.prisma.version.findFirst({
            where: { componentId: component.id },
            orderBy: { createdAt: 'desc' }
        });

        if (!versionRecord) throw new NotFoundException('Version not found');

        // Increment download count
        await this.prisma.component.update({
            where: { id: component.id },
            data: { downloads: { increment: 1 } }
        });

        return {
            org: orgName,
            component: componentName,
            version: versionRecord.version,
            url: 'mock', // Not used in this demo implementation
            content: versionRecord.s3Key, // Return content directly
            metadata: JSON.parse(versionRecord.metadata as string || '{}')
        };
    }

    async list(orgName: string, onlyPublic: boolean = false) {
        const org = await this.prisma.organization.findUnique({
            where: { name: orgName },
            include: {
                components: {
                    where: onlyPublic ? { isPublic: true } : {}, // Filter if required
                    include: {
                        versions: {
                            orderBy: { createdAt: 'desc' },
                            take: 1
                        }
                    }
                }
            }
        });

        if (!org) throw new NotFoundException('Org not found');

        return org.components.map((c: any) => ({
            id: c.id,
            name: c.name,
            isPublic: c.isPublic,
            latestVersion: c.versions[0]?.version || '0.0.0',
            updatedAt: c.updatedAt,
            downloads: c.downloads
        }));
    }

    async listAll() {
        return this.prisma.component.findMany({
            include: {
                org: { include: { owner: true } },
                versions: { take: 1, orderBy: { createdAt: 'desc' } }
            }
        });
    }

    async getStats() {
        const totalShips = await this.prisma.version.count();
        const totalFetchesAgg = await this.prisma.component.aggregate({
            _sum: { downloads: true }
        });
        return {
            totalShips,
            totalFetches: totalFetchesAgg._sum.downloads || 0
        };
    }

    async deleteComponent(id: string, user: any) {
        const component = await this.prisma.component.findUnique({
            where: { id },
            include: { org: true }
        });

        if (!component) throw new NotFoundException('Component not found');

        // Check ownership
        if (component.org.ownerId !== user.id) {
            throw new ForbiddenException('You do not have permission to delete this component');
        }

        // Delete all versions
        await this.prisma.version.deleteMany({ where: { componentId: id } });

        // Delete component
        return this.prisma.component.delete({ where: { id } });
    }

    async getComponentDetails(id: string) {
        const component = await this.prisma.component.findUnique({
            where: { id },
            include: {
                org: true,
                versions: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        });
        if (!component) throw new NotFoundException('Component not found');

        return {
            id: component.id,
            name: component.name,
            org: component.org.name,
            isPublic: component.isPublic,
            latestVersion: component.versions[0]?.version || '0.0.0',
            updatedAt: component.updatedAt,
            content: component.versions[0]?.s3Key || '', // Return code content
            downloads: component.downloads
        };
    }

    async updateComponent(id: string, content: string, user: any) {
        const component = await this.prisma.component.findUnique({
            where: { id },
            include: { org: true }
        });

        if (!component) throw new NotFoundException('Component not found');

        if (component.org.ownerId !== user.id) {
            throw new ForbiddenException('You do not have permission to update this component');
        }

        // Create new version
        // Increment logic simplified: append timestamp
        const versionString = `1.0.${Date.now()}`;

        await this.prisma.version.create({
            data: {
                componentId: component.id,
                version: versionString,
                s3Key: content,
                metadata: JSON.stringify({ updatedBy: 'web-editor' }),
            }
        });

        return { success: true, version: versionString };
    }
}
