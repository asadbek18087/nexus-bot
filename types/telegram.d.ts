declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        initData: string;
        initDataUnsafe: {
          query_id?: string;
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            is_premium?: boolean;
            photo_url?: string;
          };
          auth_date: string;
          hash: string;
        };
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
        isExpanded: boolean;
        viewportChanged: () => void;
        onEvent: (eventType: string, callback: () => void) => void;
        offEvent: (eventType: string, callback: () => void) => void;
        sendData: (data: string) => void;
        openLink: (url: string) => void;
        openTelegramLink: (url: string) => void;
        openInvoice: (url: string, callback: (status: string) => void) => void;
        showPopup: (popup: any, callback: (button_id: string) => void) => void;
        showAlert: (message: string, callback?: () => void) => void;
        showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        CloudStorage: {
          setItem: (key: string, value: string, callback?: (error: Error | null) => void) => void;
          getItem: (key: string, callback: (error: Error | null, value: string | null) => void) => void;
          removeItem: (key: string, callback?: (error: Error | null) => void) => void;
          getKeys: (callback: (error: Error | null, keys: string[]) => void) => void;
        };
        BiometricManager: {
          isAvailable: boolean;
          isAccessGranted: boolean;
          isAccessRequested: boolean;
          authenticate: (reason?: string, callback?: (isAuthenticated: boolean) => void) => void;
          requestAccess: (reason?: string, callback?: (isAccessGranted: boolean) => void) => void;
          updateToken: (token: string, callback?: (isUpdated: boolean) => void) => void;
        };
        SettingsButton: {
          isVisible: boolean;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showProgress: (leaveActive: boolean) => void;
          hideProgress: () => void;
          setParams: (params: { color?: string; text_color?: string; is_active?: boolean }) => void;
        };
        SecondaryButton: {
          position: 'left' | 'right';
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          setParams: (params: { color?: string; text_color?: string; is_active?: boolean }) => void;
        };
        HeaderColor: {
          setColor: (color: string) => void;
          getColor: () => string;
        };
        BottomBarColor: {
          setColor: (color: string) => void;
          getColor: () => string;
        };
        setBackgroundColor: (color: string) => void;
      };
    };
  }
}

export {};
