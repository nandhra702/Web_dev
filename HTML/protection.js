
(function () {
  "use strict";

  let tabSwitchCount = 0;
  const MAX_TAB_SWITCHES = 2;
  const REDIRECT_URL = "http://127.0.0.1:5500/HTML/index.html"; 

  // Track when the page loses focus (tab switch/minimize)
  let isPageVisible = true;
  let isScriptAlert = false; // Flag to track if we're showing our own alerts
  let alertTimeout = null;

  // Function to show alert without triggering tab switch detection
  function showScriptAlert(message) {
    isScriptAlert = true;
    alert(message);
    // Clear the flag after a short delay to account for focus events
    clearTimeout(alertTimeout);
    alertTimeout = setTimeout(() => {
      isScriptAlert = false;
    }, 100);
  }

  // Function to handle visibility change
  function handleVisibilityChange() {
    // Ignore visibility changes caused by our own alerts
    if (isScriptAlert) {
      return;
    }

    if (document.hidden) {
      // Page is now hidden (tab switched away)
      isPageVisible = false;
    } else {
      // Page is now visible (tab switched back)
      if (!isPageVisible) {
        tabSwitchCount++;
        console.log(`Tab switch detected. Count: ${tabSwitchCount}`);

        // Show warning or redirect
        if (tabSwitchCount >= MAX_TAB_SWITCHES) {
          showScriptAlert("Maximum tab switches exceeded. Redirecting...");
          window.location.href = REDIRECT_URL;
          return;
        } else {
          showScriptAlert(
            `Warning: Tab switching detected (${tabSwitchCount}/${MAX_TAB_SWITCHES}). ${
              MAX_TAB_SWITCHES - tabSwitchCount
            } remaining.`
          );
        }
      }
      isPageVisible = true;
    }
  }

  // Function to prevent copy operations
  function preventCopy(e) {
    e.preventDefault();
    e.stopPropagation();
    showScriptAlert("Copying is not allowed on this page.");
    return false;
  }

  // Function to prevent cut operations
  function preventCut(e) {
    e.preventDefault();
    e.stopPropagation();
    showScriptAlert("Cutting is not allowed on this page.");
    return false;
  }

  // Function to prevent paste operations
  function preventPaste(e) {
    e.preventDefault();
    e.stopPropagation();
    showScriptAlert("Pasting is not allowed on this page.");
    return false;
  }

  // Function to prevent right-click context menu
  function preventRightClick(e) {
    e.preventDefault();
    showScriptAlert("Right-click is disabled on this page.");
    return false;
  }

  // Function to prevent text selection
  function preventSelection(e) {
    e.preventDefault();
    return false;
  }

  // Function to handle keyboard shortcuts
  function handleKeydown(e) {
    // Prevent Ctrl+C, Ctrl+A, Ctrl+X, Ctrl+V, Ctrl+S, Ctrl+P, F12, Ctrl+Shift+I, Ctrl+U
    if (
      e.ctrlKey &&
      (e.keyCode === 67 || // C
        e.keyCode === 65 || // A
        e.keyCode === 88 || // X
        e.keyCode === 86 || // V
        e.keyCode === 83 || // S
        e.keyCode === 80) // P
    ) {
      e.preventDefault();
      showScriptAlert("This keyboard shortcut is disabled.");
      return false;
    }

    // Prevent F12 (Developer Tools)
    if (e.keyCode === 123) {
      e.preventDefault();
      showScriptAlert("Developer tools are disabled.");
      return false;
    }

    // Prevent Ctrl+Shift+I (Developer Tools)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
      e.preventDefault();
      showScriptAlert("Developer tools are disabled.");
      return false;
    }

    // Prevent Ctrl+U (View Source)
    if (e.ctrlKey && e.keyCode === 85) {
      e.preventDefault();
      showScriptAlert("View source is disabled.");
      return false;
    }

    // Prevent Alt+Tab (though this might not work in all browsers)
    if (e.altKey && e.keyCode === 9) {
      e.preventDefault();
      return false;
    }
  }

  // Initialize when DOM is loaded
  function initialize() {
    // Add visibility change listener for tab switching detection
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Add window focus/blur listeners as backup
    window.addEventListener("blur", function () {
      // Don't count blur events caused by our own alerts
      if (!isScriptAlert) {
        isPageVisible = false;
      }
    });

    window.addEventListener("focus", function () {
      // Don't count focus events caused by our own alerts
      if (isScriptAlert) {
        return;
      }

      if (!isPageVisible) {
        tabSwitchCount++;
        console.log(`Tab switch detected (focus). Count: ${tabSwitchCount}`);

        if (tabSwitchCount >= MAX_TAB_SWITCHES) {
          showScriptAlert("Maximum tab switches exceeded. Redirecting...");
          window.location.href = REDIRECT_URL;
          return;
        } else {
          showScriptAlert(
            `Warning: Tab switching detected (${tabSwitchCount}/${MAX_TAB_SWITCHES}). ${
              MAX_TAB_SWITCHES - tabSwitchCount
            } remaining.`
          );
        }
      }
      isPageVisible = true;
    });

    // Prevent copy/paste operations
    document.addEventListener("copy", preventCopy);
    document.addEventListener("cut", preventCut);
    document.addEventListener("paste", preventPaste);

    // Prevent right-click
    document.addEventListener("contextmenu", preventRightClick);

    // Prevent text selection
    document.addEventListener("selectstart", preventSelection);
    document.addEventListener("mousedown", preventSelection);

    // Handle keyboard shortcuts
    document.addEventListener("keydown", handleKeydown);

    // Disable drag and drop
    document.addEventListener("dragstart", function (e) {
      e.preventDefault();
      return false;
    });

    // Additional CSS to prevent text selection
    const style = document.createElement("style");
    style.textContent = `
          * {
              -webkit-user-select: none !important;
              -moz-user-select: none !important;
              -ms-user-select: none !important;
              user-select: none !important;
              -webkit-touch-callout: none !important;
              -webkit-tap-highlight-color: transparent !important;
          }
          
          body {
              -webkit-user-select: none !important;
              -moz-user-select: none !important;
              -ms-user-select: none !important;
              user-select: none !important;
          }
      `;
    document.head.appendChild(style);

    console.log("Tab switch and copy prevention initialized");
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

  // Prevent console access attempts
  let devtools = {
    open: false,
    orientation: null,
  };

  // Check for developer tools
  setInterval(function () {
    if (
      window.outerHeight - window.innerHeight > 200 ||
      window.outerWidth - window.innerWidth > 200
    ) {
      if (!devtools.open) {
        devtools.open = true;
        showScriptAlert("Developer tools detected. Please close them.");
        window.location.href = REDIRECT_URL;
      }
    } else {
      devtools.open = false;
    }
  }, 500);
})();
