interface AppState {
    currentStyle: {
        name: string;
        file: string;
    };
    availableStyles: Map<string, string>;
}

const appState: AppState = {
    currentStyle: {
        name: 'style1',
        file: 'style1.css'
    },
    availableStyles: new Map([
        ['style1', 'style/style1.css'],
        ['style2', 'style/style2.css'],
        ['style3', 'style/style3.css']
    ])
};

function setStyle(styleName: string): void {
    if (!appState.availableStyles.has(styleName)) {
        console.error(`Style "${styleName}" not found in available styles`);
        return;
    }

    const newStyleFile = appState.availableStyles.get(styleName)!;
    
    appState.currentStyle = {
        name: styleName,
        file: newStyleFile
    };

    updateStylesheet(newStyleFile);
    updateStyleSwitcherUI();
}

function updateStylesheet(styleFile: string): void {
    const oldLink = document.getElementById('pagestyle') as HTMLLinkElement;
    
    if (!oldLink) {
        console.error('Could not find stylesheet element with id "pagestyle"');
        return;
    }

    const newLink = document.createElement('link');
    newLink.id = 'pagestyle';
    newLink.rel = 'stylesheet';
    newLink.href = styleFile;

    const head = document.head;
    head.removeChild(oldLink);
    head.appendChild(newLink);

    console.log(`Switched to ${styleFile}`);
}

function createStyleSwitcherLinks(): void {
    let switcherContainer = document.getElementById('style-switcher-container');
    
    if (!switcherContainer) {
        switcherContainer = document.createElement('div');
        switcherContainer.id = 'style-switcher-container';
        switcherContainer.style.textAlign = 'center';
        switcherContainer.style.margin = '20px 0';
        
        const h3 = document.querySelector('h3');
        if (h3 && h3.parentNode) {
            h3.parentNode.insertBefore(switcherContainer, h3.nextSibling);
        } else {
            document.body.insertBefore(switcherContainer, document.body.firstChild);
        }
    }

    switcherContainer.innerHTML = '';

    appState.availableStyles.forEach((file, name) => {
        const button = document.createElement('button');
        button.className = 'style-button';
        button.textContent = `Switch to ${name}`;
        button.setAttribute('data-style', name);
        
        button.addEventListener('click', () => {
            setStyle(name);
        });
        
        switcherContainer.appendChild(button);
    });

    const indicator = document.createElement('p');
    indicator.id = 'current-style-indicator';
    indicator.style.marginTop = '10px';
    indicator.style.fontStyle = 'italic';
    indicator.textContent = `Current style: ${appState.currentStyle.name}`;
    switcherContainer.appendChild(indicator);
}

function updateStyleSwitcherUI(): void {
    const indicator = document.getElementById('current-style-indicator');
    if (indicator) {
        indicator.textContent = `Current style: ${appState.currentStyle.name}`;
    }
}

function initApp(): void {
    console.log('Initializing style switcher application...');
    
    const oldButtons = document.querySelectorAll('button[onclick^="setStyle"]');
    oldButtons.forEach(button => {
        button.remove();
    });

    createStyleSwitcherLinks();
    
    (window as any).setStyle = setStyle;
    
    console.log('Application initialized. Available styles:', 
        Array.from(appState.availableStyles.entries()));
    console.log('Current style:', appState.currentStyle.name);
}

document.addEventListener('DOMContentLoaded', initApp);

export { setStyle, initApp, appState };