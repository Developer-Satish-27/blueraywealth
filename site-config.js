/**
 * BlueRay Wealth - Central Site Configuration
 * Controls personal details, contact endpoints, and lead routing.
 * Can be updated via Admin Portal (admin.html).
 */
(function (window) {
  'use strict';

  const STORAGE_KEY = 'blueray_site_config';

  const DEFAULT_CONFIG = {
    // Personal & Professional
    distributorName: "Suresh Saini",
    arnNumber: "ARN-347947",
    partnerPlatform: "NJ Wealth",
    
    // Contact Information
    phone: "+91 9923861051",
    whatsappNumber: "919923861051",
    email: "blueraywealth0007@gmail.com",
    city: "Jaipur, Rajasthan",
    officeAddress: "Jaipur, Rajasthan, India",
    
    // Notification & Lead Routing
    emailNotifications: true,
    notificationEmail: "blueraywealth0007@gmail.com",
    web3FormsKey: "", // Optional Web3Forms key
    whatsappNotifications: true,
    
    // Admin Security (Default PIN: 2710)
    adminPin: "2710"
  };

  const SiteConfig = {
    get: function () {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return Object.assign({}, DEFAULT_CONFIG, JSON.parse(stored));
        }
      } catch (e) {
        console.warn('Could not read site config from localStorage:', e);
      }
      return Object.assign({}, DEFAULT_CONFIG);
    },

    save: function (newConfig) {
      try {
        const merged = Object.assign({}, this.get(), newConfig);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        this.applyToDOM();
        return { success: true, config: merged };
      } catch (e) {
        console.error('Error saving site config:', e);
        return { success: false, error: e.message };
      }
    },

    reset: function () {
      try {
        localStorage.removeItem(STORAGE_KEY);
        this.applyToDOM();
        return { success: true, config: DEFAULT_CONFIG };
      } catch (e) {
        return { success: false, error: e.message };
      }
    },

    // Dynamically update personal details in DOM elements that declare data-config-key
    applyToDOM: function () {
      const cfg = this.get();
      document.querySelectorAll('[data-config-key]').forEach(function (el) {
        const key = el.getAttribute('data-config-key');
        if (cfg[key]) {
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.value = cfg[key];
          } else {
            el.textContent = cfg[key];
          }
        }
      });

      // Update WhatsApp links
      const cleanPhone = cfg.whatsappNumber.replace(/[^\d]/g, '');
      document.querySelectorAll('a[href*="wa.me"]').forEach(function (a) {
        const href = a.getAttribute('href');
        const match = href.match(/wa\.me\/(\d*)\?(.*)/);
        if (match) {
          a.setAttribute('href', 'https://wa.me/' + cleanPhone + '?' + match[2]);
        } else if (href.includes('wa.me/')) {
          a.setAttribute('href', 'https://wa.me/' + cleanPhone);
        }
      });
    }
  };

  window.SiteConfig = SiteConfig;

  // Auto-apply on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      SiteConfig.applyToDOM();
    });
  } else {
    SiteConfig.applyToDOM();
  }

})(window);
