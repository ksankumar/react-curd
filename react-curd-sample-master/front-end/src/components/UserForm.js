import React from "react";
import InputText from './textInput/InputText';
import Button from './button/Button';

class ColorApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            fname: "san",
            loading: true,
            validColor: false
        };

        this.handleColorChange = this.handleColorChange.bind(this);
        this.addSwatch = this.addSwatch.bind(this);
    }

    componentDidMount() {

    }

    handleColorChange(event) {
        const isValid = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/i.test(event.target.value)
        this.setState({ color: event.target.value, validColor: isValid });
    }

    addSwatch(event) {
        event.preventDefault();

    }

    render() {
        return (
            <div className="fade-in">
                <form className="form-container" onSubmit={this.addSwatch}>
                    <InputText
                        label="First name"
                        placeholder="John doe"
                        name="fname"
                        value={this.state.fname}
                        // autocomplete="given-name"
                        active={false}
                        clearIcon={true}
                    />
                    <InputText
                        id={1}
                        label="Last name"
                        placeholder="John doe"
                        name="lname"
                        // autocomplete="family-name"
                        active={false}
                    />

                    {/* <input className="color-input pad col-7"
                        type="text"
                        name="color"
                        placeholder="#C0FFEE"
                        pattern="^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$"
                        onInvalid={(e) => e.target.setCustomValidity('Invalid color format. e.g. #FF0000')}
                        onInput={(e) => e.target.setCustomValidity('')}
                        onChange={this.handleColorChange}
                        value={this.state.color}
                        required />
                    <button type="submit" className="add-btn pad col-3" disabled={!this.state.validColor}>Add
                        Swatch
                        </button> */}
                        <Button></Button>
                </form>
                {/* <ColorList items={this.state.items}/> */}
            </div>
        );
    }
}

export default ColorApp;