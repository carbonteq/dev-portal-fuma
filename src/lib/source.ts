import { docs } from '@/.source';
import { loader } from 'fumadocs-core/source';
import { icons } from 'lucide-react';
import * as ReactIcons from 'react-icons/fa';
import { createElement } from 'react';

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
export const source = loader({
  // it assigns a URL to your pages
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  icon(icon) {
    if (!icon) {
      return;
    }

    // Handle prefixed icons: "lucide:Home", "iconoir:User", "fa:FaHome"
    if (icon.includes(':')) {
      const [library, iconName] = icon.split(':');
      
      switch (library) {
        case 'lucide':
          if (iconName in icons) {
            return createElement(icons[iconName as keyof typeof icons]);
          }
          break;
        case 'iconoir':
          try {
            const iconoirModule = require('iconoir-react');
            const IconoirIcon = iconoirModule[iconName];
            if (IconoirIcon && typeof IconoirIcon === 'function') {
              return createElement(IconoirIcon);
            }
          } catch (e) {
            // Iconoir icon not found
          }
          break;
        case 'fa':
          if (iconName in ReactIcons) {
            return createElement(ReactIcons[iconName as keyof typeof ReactIcons]);
          }
          break;
      }
    } else {
      // Default behavior - try Lucide first (for backward compatibility)
      if (icon in icons) {
        return createElement(icons[icon as keyof typeof icons]);
      }
    }

    // No icon found
    return;
  },
});
