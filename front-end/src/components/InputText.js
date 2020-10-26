import React from "react";
import "./inputStyle.css";

class InputText extends React.Component {
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

    handleKeyPress(event) {
        if (event.which === 13) {
        }
    }

    render() {
        const { active, value, error, label, name, placeholder, autocomplete, clearIcon } = this.state;
        const fieldClassName = `field ${(active || value) && 'active'}`;

        return (
            <div className={fieldClassName}>
                <input
                    id={name}
                    type="text"
                    value={value}
                    placeholder={active ? placeholder : label}
                    name={name}
                    autoComplete={autocomplete}
                    onChange={this.changeValue.bind(this)}
                    onKeyPress={this.handleKeyPress.bind(this)}
                    onFocus={() => this.setState({ active: true })}
                    onBlur={() => this.setState({ active: false })}
                />
                <label htmlFor={name} className={error && "error"}>
                    {error || label}
                </label>
                <div className="input-icon append-icon">
                    <i className="fa fa-user"></i>
                </div>
                {clearIcon ?
                    <div className="input-icon prepend-icon">
                        <i className="far fa-times-circle" onClick={() => this.setState({ value: '' })}></i>
                    </div>
                    : null}
            </div>
        );
    }
}

export default InputText;