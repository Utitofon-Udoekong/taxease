
interface ProfileSettings {
  name: string;
  email: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
}

interface TaxSettings {
  defaultCurrency: string;
  reportingPeriod: 'monthly' | 'quarterly' | 'yearly';
  categories: string[];
}

export const useSettingsStore = defineStore('settings', () => {
  // State
  const profileSettings = ref<ProfileSettings>({
    name: '',
    email: '',
    notifications: {
      email: true,
      push: false
    }
  });

  const taxSettings = ref<TaxSettings>({
    defaultCurrency: 'ETH',
    reportingPeriod: 'monthly',
    categories: []
  });

  // Actions
  function updateProfileSettings(settings: ProfileSettings) {
    profileSettings.value = settings;
  }

  function updateTaxSettings(settings: TaxSettings) {
    taxSettings.value = settings;
  }

  return {
    profileSettings,
    taxSettings,
    updateProfileSettings,
    updateTaxSettings
  };
}, {
  persist: true // Enable persistence
}); 