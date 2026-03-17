import { IrrecoverableError, RecoverableError } from "../../Error/Error";

export type ImageData = {
    type: 'svg';
    lightThemeImageSrc: string;
    lightThemeImageAlt: string;
    darkThemeImageSrc: string;
    darkThemeImageAlt: string;
    mobileLightThemeImageSrc: string;
    mobileLightThemeImageAlt: string;
    mobileDarkThemeImageSrc: string;
    mobileDarkThemeImageAlt: string;
};

export type Brand = {
    type: 'Brand';
    data: { href: string; label: string; isDarkBg: boolean; imageData: ImageData }
};

const ERRORS = {
    elementNull: "Error when parsing Brand. Element is null",
    noLinkSection: "Error when parsing Brand. No link section found",
    noLink: "Error when parsing Brand. No link found",
    noImageSection: "Error when parsing Brand. No image section found",
    missingImageSections: "Error when parsing Brand. Missing mobile or desktop image section",
    missingThemeImages: "Error when parsing Brand. Missing mobile or desktop image section",
};

export const parseBrand = (
    element: Element | null,
): Parsed<Brand, RecoverableError> => {
    const errors = new Set<RecoverableError>();
    if (element === null) {
        throw new IrrecoverableError(ERRORS.elementNull);
    }

    const isDarkBg = !!element.classList.contains('dark-bg');

    const [linkSection, imagesSection] = element.querySelectorAll(':scope > div');
    if (linkSection === undefined) {
        throw new IrrecoverableError(ERRORS.noLinkSection);
    }

    const linkElement = linkSection.querySelector('a');
    if (linkElement === null) {
        throw new IrrecoverableError(ERRORS.noLink);
    }

    const href = linkElement.getAttribute('href') ?? '';
    const label = linkElement.textContent?.trim() ?? '';

    if (imagesSection === undefined) {
        errors.add(new RecoverableError(ERRORS.noImageSection));
    }

    const [mobileImageSection, desktopImageSection] = imagesSection?.querySelectorAll(':scope > div') ?? [];
    if (mobileImageSection === undefined || desktopImageSection === undefined) {
        errors.add(new RecoverableError(ERRORS.missingImageSections));
    }

    const lightThemeImages = mobileImageSection?.querySelectorAll('a[href$=".svg"]');
    const darkThemeImages = desktopImageSection?.querySelectorAll('a[href$=".svg"]');

    const lightThemeMobileImageSrc = lightThemeImages?.[0]?.getAttribute('href') ?? '';
    const lightThemeMobileImageAlt = lightThemeImages?.[0]?.textContent?.split('|')[1]?.trim() ?? '';
    const darkThemeMobileImageSrc = lightThemeImages?.[1]?.getAttribute('href') ?? '';
    const darkThemeMobileImageAlt = lightThemeImages?.[1]?.textContent?.split('|')[1]?.trim() ?? '';
    const lightThemeDesktopImageSrc = darkThemeImages?.[0]?.getAttribute('href') ?? '';
    const lightThemeDesktopImageAlt = darkThemeImages?.[0]?.textContent?.split('|')[1]?.trim() ?? '';
    const darkThemeDesktopImageSrc = darkThemeImages?.[1]?.getAttribute('href') ?? '';
    const darkThemeDesktopImageAlt = darkThemeImages?.[1]?.textContent?.split('|')[1]?.trim() ?? '';

    if (!lightThemeMobileImageSrc || !lightThemeDesktopImageSrc || !darkThemeMobileImageSrc || !darkThemeDesktopImageSrc) {
        errors.add(new RecoverableError(ERRORS.missingThemeImages));
    }

    return [{
        type: 'Brand',
        data: {
            href,
            label,
            isDarkBg,
            imageData: {
                type: 'svg',
                lightThemeImageSrc: lightThemeDesktopImageSrc,
                lightThemeImageAlt: lightThemeDesktopImageAlt,
                darkThemeImageSrc: darkThemeDesktopImageSrc,
                darkThemeImageAlt: darkThemeDesktopImageAlt,
                mobileLightThemeImageSrc: lightThemeMobileImageSrc,
                mobileLightThemeImageAlt: lightThemeMobileImageAlt,
                mobileDarkThemeImageSrc: darkThemeMobileImageSrc,
                mobileDarkThemeImageAlt: darkThemeMobileImageAlt,
            },
        },
    }, [...errors]]
};
