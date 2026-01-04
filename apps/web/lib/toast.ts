export const toast = {
    success: (settings: any) => import('izitoast').then((m: any) => m.default.success(settings)),
    error: (settings: any) => import('izitoast').then((m: any) => m.default.error(settings)),
    warning: (settings: any) => import('izitoast').then((m: any) => m.default.warning(settings)),
    info: (settings: any) => import('izitoast').then((m: any) => m.default.info(settings)),
    loading: (message: string, settings: any = {}) => import('izitoast').then((m: any) => m.default.info({ ...settings, message })),
};
