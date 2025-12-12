// Cookie Consent initialization script
// This will be bundled by Astro and served as a first-party asset
import * as CookieConsent from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';

// Get GA tracking ID from global variable set by Astro component
declare global {
  interface Window {
    __GA_TRACKING_ID__?: string;
  }
}

const gaTrackingId = window.__GA_TRACKING_ID__ || '';

// Function to load Google Analytics
function loadGoogleAnalytics(trackingId: string) {
  // Check if GA is already loaded
  if ((window as any).gtag) {
    // Update consent mode
    (window as any).gtag('consent', 'update', {
      'analytics_storage': 'granted'
    });
    return;
  }

  // Initialize Google Consent Mode v2
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]){
    ((window as any).dataLayer).push(arguments);
  }
  gtag('js', new Date());
  gtag('consent', 'default', {
    'analytics_storage': 'denied'
  });
  
  // Update consent mode when user accepts
  gtag('consent', 'update', {
    'analytics_storage': 'granted'
  });

  // Load Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
  document.head.appendChild(script);

  // Initialize GA
  gtag('config', trackingId, {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure'
  });

  (window as any).gtag = gtag;
}

// Function to remove Google Analytics
function removeGoogleAnalytics() {
  // Remove GA script
  const gaScript = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
  if (gaScript) {
    gaScript.remove();
  }

  // Clear GA cookies
  const cookies = document.cookie.split(';');
  cookies.forEach(cookie => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    if (name.startsWith('_ga')) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
  });

  // Clear dataLayer
  if ((window as any).dataLayer) {
    (window as any).dataLayer = [];
  }
  
  delete (window as any).gtag;
}

// Helper function to check Cal status
function checkCalStatus() {
  return (window as any).Cal && (window as any).Cal.loaded;
}

// Helper function to clear Cal.com queue if element doesn't exist
function clearCalQueueIfElementMissing() {
  const element = document.getElementById('my-cal-inline-15min');
  if (!element && (window as any).Cal && (window as any).Cal.ns && (window as any).Cal.ns["15min"]) {
    // Clear the queue to prevent errors
    if ((window as any).Cal.ns["15min"].q) {
      (window as any).Cal.ns["15min"].q = [];
    }
  }
}

// Centralized function to handle consent changes (called from onConsent and when preferences modal closes)
function handleConsentChange() {
  const analyticsConsent = CookieConsent.acceptedCategory('analytics');
  const functionalityConsent = CookieConsent.acceptedCategory('functionality');
  
  if (analyticsConsent && gaTrackingId) {
    // Load Google Analytics only if consent is given
    loadGoogleAnalytics(gaTrackingId);
  } else {
    // Remove GA if consent is withdrawn
    removeGoogleAnalytics();
  }

  if (functionalityConsent) {
    // Load Cal.com only if consent is given
    loadCalCom();
  } else {
    // Remove Cal.com if consent is withdrawn
    removeCalCom();
  }
}

// Function to load Cal.com embed
function loadCalCom() {
  // First check if the target element exists - only initialize if it does
  const targetElement = document.getElementById('my-cal-inline-15min');
  if (!targetElement) {
    // Element doesn't exist on this page, don't load Cal.com
    return;
  }

  // Check if Cal.com is already loaded and initialized
  if (checkCalStatus()) {
    // Re-initialize if already loaded but check if namespace exists
    if ((window as any).Cal.ns && (window as any).Cal.ns["15min"]) {
      initializeCalComEmbed();
    }
    return;
  }

  // Check if script is already in the DOM
  const existingScript = document.querySelector('script[src*="app.cal.eu/embed/embed.js"]');
  if (existingScript) {
    // Script is loading, wait for it and then initialize
    const checkCal = setInterval(() => {
      if (checkCalStatus() && document.getElementById('my-cal-inline-15min')) {
        clearInterval(checkCal);
        initializeCalComEmbed();
      }
    }, 50);
    // Timeout after 5 seconds
    setTimeout(() => clearInterval(checkCal), 5000);
    return;
  }

  // Initialize Cal.com embed loader
  (function (C: any, A: string, L: string) { 
    let p = function (a: any, ar: any) { a.q.push(ar); }; 
    let d = C.document; 
    C.Cal = C.Cal || function () { 
      let cal = C.Cal; 
      let ar = arguments; 
      if (!cal.loaded) { 
        cal.ns = {}; 
        cal.q = cal.q || []; 
        const script = d.createElement("script");
        script.src = A;
        script.onload = () => {
          // Wait a bit for Cal to initialize, then set up the embed
          // Only initialize if element still exists
          setTimeout(() => {
            if (document.getElementById('my-cal-inline-15min')) {
              initializeCalComEmbed();
            }
          }, 100);
        };
        d.head.appendChild(script);
        cal.loaded = true; 
      } 
      if (ar[0] === L) { 
        const api = function () { p(api, arguments); }; 
        const namespace = ar[1]; 
        const apiQueue: any[] = (api as any).q || [];
        (api as any).q = apiQueue;
        if(typeof namespace === "string"){
          cal.ns[namespace] = cal.ns[namespace] || api;
          p(cal.ns[namespace], ar);
          p(cal, ["initNamespace", namespace]);
        } else p(cal, ar); 
        return;
      } 
      p(cal, ar); 
    }; 
  })(window, "https://app.cal.eu/embed/embed.js", "init");
  
  // Only queue initialization commands if element exists
  if (document.getElementById('my-cal-inline-15min')) {
    // Queue initialization commands (they'll execute when script loads)
    (window as any).Cal("init", "15min", {origin:"https://app.cal.eu"});

    (window as any).Cal.ns = (window as any).Cal.ns || {};
    if (!(window as any).Cal.ns["15min"]) {
      const queue: any[] = [];
      (window as any).Cal.ns["15min"] = function(...args: any[]) {
        // Only queue if element exists
        if (document.getElementById('my-cal-inline-15min')) {
          queue.push(args);
        }
      };
      (window as any).Cal.ns["15min"].q = queue;
    }
  }
}

// Track if Cal.com embed has been initialized to prevent duplicate initialization
let calComInitialized = false;

// Helper function to initialize Cal.com embed
function initializeCalComEmbed() {
  // Check if already initialized
  if (calComInitialized) {
    return;
  }

  // Check if the target element exists - if not, don't initialize
  const targetElement = document.getElementById('my-cal-inline-15min');
  if (!targetElement) {
    // Element doesn't exist on this page, silently return
    return;
  }

  // Check if Cal.com embed is already rendered in the element
  const hasCalContent = targetElement.querySelector('[data-cal-namespace]') || 
                        targetElement.querySelector('iframe');
  if (hasCalContent) {
    // Already initialized, mark as such and return
    calComInitialized = true;
    window.dispatchEvent(new CustomEvent('calcom-loaded'));
    return;
  }

  // Make sure Cal is loaded and namespace exists
  if (!(window as any).Cal || !(window as any).Cal.loaded) {
    // Wait for Cal to load
    setTimeout(() => {
      if ((window as any).Cal && (window as any).Cal.loaded && document.getElementById('my-cal-inline-15min') && !calComInitialized) {
        initializeCalComEmbed();
      }
    }, 100);
    return;
  }

  if (!(window as any).Cal.ns || !(window as any).Cal.ns["15min"]) {
    return;
  }

  try {
    (window as any).Cal.ns["15min"]("inline", {
      elementOrSelector:"#my-cal-inline-15min",
      config: {"layout":"month_view"},
      calLink: "gaworski/15min",
    });

    (window as any).Cal.ns["15min"]("ui", {"hideEventTypeDetails":false,"layout":"month_view"});

    // Mark as initialized
    calComInitialized = true;

    // Dispatch event to notify that Cal.com is loaded
    window.dispatchEvent(new CustomEvent('calcom-loaded'));
  } catch (error) {
    // Silently handle errors - element might not be ready yet
    // Only log if element exists (to avoid console spam on pages without the element)
    if (document.getElementById('my-cal-inline-15min')) {
      console.warn('Cal.com initialization error:', error);
      // Retry after a short delay only if element exists and not already initialized
      setTimeout(() => {
        if (document.getElementById('my-cal-inline-15min') && !calComInitialized) {
          initializeCalComEmbed();
        }
      }, 500);
    }
  }
}

// Function to remove Cal.com embed
function removeCalCom() {
  // Reset initialization flag
  calComInitialized = false;

  // Remove Cal.com script
  const calScript = document.querySelector('script[src*="app.cal.eu/embed/embed.js"]');
  if (calScript) {
    calScript.remove();
  }

  // Clear Cal.com namespace
  if ((window as any).Cal) {
    delete (window as any).Cal;
  }

  // Clear the embed container but preserve placeholder structure
  const embedContainer = document.getElementById('my-cal-inline-15min');
  if (embedContainer) {
    // Only clear if Cal.com content exists, otherwise leave placeholder
    const calContent = embedContainer.querySelector('[data-cal-namespace]') || 
                       embedContainer.querySelector('iframe');
    if (calContent) {
      embedContainer.innerHTML = `
        <div class="calcom-consent-placeholder" style="padding: 3rem; text-align: center; color: #666; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 600px; width: 100%;">
          <div class="cookie-icon-wrapper" style="margin-bottom: 1.5rem;">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5Z"></path><path d="M8.5 8.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1Z"></path><path d="M15.5 8.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1Z"></path></svg>
          </div>
          <p style="margin-bottom: 1.5rem; font-size: 1.1rem; margin: 0 0 1.5rem 0;">To book an appointment, please accept functionality cookies in the cookie consent banner.</p>
          <button id="calcom-cookie-preferences-btn" class="cookie-preferences-btn">Manage Cookie Preferences</button>
        </div>
      `;
    }
  }

  // Dispatch event to notify Contact component
  window.dispatchEvent(new CustomEvent('calcom-removed'));
}

// Initialize cookie consent
CookieConsent.run({
  categories: {
    necessary: {
      enabled: true, // Always enabled
      readOnly: true // User cannot disable
    },
    analytics: {
      enabled: false, // Requires user consent
      readOnly: false
    },
    functionality: {
      enabled: false, // Requires user consent
      readOnly: false
    }
  },
  language: {
    default: 'en',
    translations: {
      en: {
        consentModal: {
          title: 'We use cookies',
          description: 'We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept all", you consent to our use of cookies. <a href="/imprint#privacy" class="cc-link">Privacy Policy</a>',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          showPreferencesBtn: 'Manage preferences'
        },
        preferencesModal: {
          title: 'Cookie Preferences',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          savePreferencesBtn: 'Save preferences',
          closeIconLabel: 'Close',
          sections: [
            {
              title: 'Cookie Usage',
              description: 'We use cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want.'
            },
            {
              title: 'Strictly Necessary Cookies',
              description: 'These cookies are essential for the proper functioning of the website. Without these cookies, the website would not work properly.',
              linkedCategory: 'necessary'
            },
            {
              title: 'Analytics Cookies',
              description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website.',
              linkedCategory: 'analytics',
              cookieTable: {
                caption: 'Analytics cookies',
                headers: {
                  name: 'Cookie',
                  domain: 'Domain',
                  desc: 'Description',
                  exp: 'Expiration'
                },
                body: [
                  {
                    name: '_ga',
                    domain: 'gaworski.de',
                    desc: 'Used to distinguish users by Google Analytics',
                    exp: '2 years'
                  },
                  {
                    name: '_ga_*',
                    domain: 'gaworski.de',
                    desc: 'Used to distinguish users by Google Analytics 4',
                    exp: '2 years'
                  }
                ]
              }
            },
            {
              title: 'Functionality Cookies',
              description: 'These cookies enable enhanced functionality and personalization, such as the calendar booking service (Cal.com). These services may collect your name, email address, and booking preferences.',
              linkedCategory: 'functionality',
              cookieTable: {
                caption: 'Functionality cookies',
                headers: {
                  name: 'Cookie',
                  domain: 'Domain',
                  desc: 'Description',
                  exp: 'Expiration'
                },
                body: [
                  {
                    name: 'Cal.com cookies',
                    domain: 'app.cal.eu',
                    desc: 'Cookies set by Cal.com for booking functionality and session management',
                    exp: 'Session / varies'
                  }
                ]
              }
            }
          ]
        }
      },
      de: {
        consentModal: {
          title: 'Wir verwenden Cookies',
          description: 'Wir verwenden Cookies, um Ihr Browsing-Erlebnis zu verbessern, den Website-Traffic zu analysieren und Inhalte zu personalisieren. Durch Klicken auf "Alle akzeptieren" stimmen Sie der Verwendung von Cookies zu. <a href="/imprint#privacy" class="cc-link">Datenschutzerklärung</a>',
          acceptAllBtn: 'Alle akzeptieren',
          acceptNecessaryBtn: 'Alle ablehnen',
          showPreferencesBtn: 'Einstellungen verwalten'
        },
        preferencesModal: {
          title: 'Cookie-Einstellungen',
          acceptAllBtn: 'Alle akzeptieren',
          acceptNecessaryBtn: 'Alle ablehnen',
          savePreferencesBtn: 'Einstellungen speichern',
          closeIconLabel: 'Schließen',
          sections: [
            {
              title: 'Cookie-Verwendung',
              description: 'Wir verwenden Cookies, um die grundlegenden Funktionen der Website sicherzustellen und Ihr Online-Erlebnis zu verbessern. Sie können für jede Kategorie jederzeit wählen, ob Sie zustimmen möchten oder nicht.'
            },
            {
              title: 'Unbedingt erforderliche Cookies',
              description: 'Diese Cookies sind für das ordnungsgemäße Funktionieren der Website unerlässlich. Ohne diese Cookies würde die Website nicht ordnungsgemäß funktionieren.',
              linkedCategory: 'necessary'
            },
            {
              title: 'Analyse-Cookies',
              description: 'Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren, indem sie Informationen anonym sammeln und melden. Dies hilft uns, unsere Website zu verbessern.',
              linkedCategory: 'analytics',
              cookieTable: {
                caption: 'Analyse-Cookies',
                headers: {
                  name: 'Cookie',
                  domain: 'Domain',
                  desc: 'Beschreibung',
                  exp: 'Ablauf'
                },
                body: [
                  {
                    name: '_ga',
                    domain: 'gaworski.de',
                    desc: 'Wird verwendet, um Benutzer durch Google Analytics zu unterscheiden',
                    exp: '2 Jahre'
                  },
                  {
                    name: '_ga_*',
                    domain: 'gaworski.de',
                    desc: 'Wird verwendet, um Benutzer durch Google Analytics 4 zu unterscheiden',
                    exp: '2 Jahre'
                  }
                ]
              }
            },
            {
              title: 'Funktions-Cookies',
              description: 'Diese Cookies ermöglichen erweiterte Funktionen und Personalisierung, wie z.B. den Kalender-Buchungsservice (Cal.com). Diese Dienste können Ihren Namen, Ihre E-Mail-Adresse und Ihre Buchungspräferenzen sammeln.',
              linkedCategory: 'functionality',
              cookieTable: {
                caption: 'Funktions-Cookies',
                headers: {
                  name: 'Cookie',
                  domain: 'Domain',
                  desc: 'Beschreibung',
                  exp: 'Ablauf'
                },
                body: [
                  {
                    name: 'Cal.com Cookies',
                    domain: 'app.cal.eu',
                    desc: 'Von Cal.com gesetzte Cookies für Buchungsfunktionalität und Sitzungsverwaltung',
                    exp: 'Sitzung / variabel'
                  }
                ]
              }
            }
          ]
        }
      }
    }
  },
  guiOptions: {
    consentModal: {
      layout: 'box inline',
      position: 'bottom right',
      equalWeightButtons: true,
      flipButtons: false
    },
    preferencesModal: {
      layout: 'box',
      position: 'right',
      equalWeightButtons: true,
      flipButtons: false
    }
  },
  onConsent: ({ cookie }) => {
    // This callback is triggered when consent is given or changed (including on page load)
    handleConsentChange();
  },
  onChange: ({ cookie, changedCategories, changedServices }) => {
    // This callback is triggered when the user modifies their preferences after initial consent
    // This handles changes made in the preferences modal
    handleConsentChange();
  },
  onFirstConsent: ({ cookie }) => {
    // This callback is triggered on first consent only
    const analyticsConsent = CookieConsent.acceptedCategory('analytics');
    const functionalityConsent = CookieConsent.acceptedCategory('functionality');
    
    if (analyticsConsent && gaTrackingId) {
      loadGoogleAnalytics(gaTrackingId);
    }

    if (functionalityConsent) {
      // Check if element exists before loading
      if (document.getElementById('my-cal-inline-15min')) {
        loadCalCom();
      }
    }
  }
});

// Clear Cal.com queue on page load if element doesn't exist (prevent errors from previous pages)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', clearCalQueueIfElementMissing);
} else {
  clearCalQueueIfElementMissing();
}

// Check if consent was already given on page load
const analyticsConsent = CookieConsent.acceptedCategory('analytics');
const functionalityConsent = CookieConsent.acceptedCategory('functionality');

if (analyticsConsent && gaTrackingId) {
  loadGoogleAnalytics(gaTrackingId);
}

// Only load Cal.com if consent is given AND the element exists on this page
if (functionalityConsent) {
  // Wait for DOM to be ready, then check for element
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      clearCalQueueIfElementMissing();
      if (document.getElementById('my-cal-inline-15min')) {
        loadCalCom();
      }
    });
  } else {
    // DOM already loaded, check immediately
    clearCalQueueIfElementMissing();
    if (document.getElementById('my-cal-inline-15min')) {
      loadCalCom();
    }
  }
}

// Function to open cookie preferences modal
function openCookiePreferences() {
  CookieConsent.showPreferences();
}

// Export functions for use in other components
declare global {
  interface Window {
    loadCalCom: () => void;
    removeCalCom: () => void;
    openCookiePreferences: () => void;
  }
}

window.loadCalCom = loadCalCom;
window.removeCalCom = removeCalCom;
window.openCookiePreferences = openCookiePreferences;

// Also listen to the onChange event using the custom event listener as a backup
// This ensures we catch preference changes even if the callback isn't triggered
document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('cc:onChange', ({ detail }: any) => {
    // User modified preferences in the preferences modal
    handleConsentChange();
  });
});

