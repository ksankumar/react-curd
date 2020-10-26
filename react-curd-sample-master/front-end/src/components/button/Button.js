import React from "react";
import "./button.css";

class Button extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            active: (props.active) || false,
            value: props.value || "",
            error: props.error || "",
            name: props.id || props.name || 'input-text',
            label: props.label || "Label",
            name: props.name || "Name",
            placeholder: props.placeholder || "",
            autocomplete: props.autocomplete || "off",
            clearIcon: (props.clearIcon) || false,
        };
    }

    changeValue(event) {
        const value = event.target.value;
        this.setState({ value, error: "" });
    }

    render() {
        return (
            <button type="button" className="button button-success" disabled>
                <i className="far fa-times-circle"></i>Success
            </button>
        );
    }
}

export default Button;