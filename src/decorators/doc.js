/**
 * Annotation decorator for documenting React components.
 * @param {Object} meta - Metadata for the component.
 */
export function Doc(meta) {
    return function (Component) {
        Component.__docgenInfo = {
            ...meta,
            name: Component.displayName || Component.name || 'UnnamedComponent',
        };
        return Component;
    };
}

/**
 * HOC alternative for projects without decorator support.
 * @param {Object} meta - Metadata for the component.
 * @param {React.Component} Component - The React component to annotate.
 */
export function withDoc(meta, Component) {
    Component.__docgenInfo = {
        ...meta,
        name: Component.displayName || Component.name || 'UnnamedComponent',
    };
    return Component;
}