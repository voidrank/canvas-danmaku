/**
 * Created by lancy on 9/23/15.
 */


var SettingBar = React.createClass({
    componentDidMount: function() {
        var self = this;
        $(signal).on("pull", function() {
            setTimeout(function() {
                $("#settingBar").css("transition", "right 1s ease").css("right", 0);
            }, 0);
        });
        $(signal).on("push", function() {
            setTimeout(function() {
                $("#settingBar").css("transistion", "right 1s ease").css("right", -250);
            }, 0);
        });
        $(signal).on("danmakuSettingsResponse", function(e, data) {
            self.setState(data);
        });
        $(signal).trigger("danmakuSettingsRequest");
    },
    getInitialState: function() {
        return {
            "speed": 20,
            "fontSize": 20,
            "iframeSrc": "",
            "channelUrl": ""
        };
    },
    onIframeSrcChange: function(l) {
        this.setState({
            "iframeSrc": l.target.value
        })
    },
    onFontSizeChange: function(l) {
        this.setState({
            "fontSize": l.target.value
        });
    },
    onSpeedChange: function(l) {
        this.setState({
            "speed": l.target.value
        });
    },
    onChannelSrcChange: function(l) {
        this.setState({
            "channelSrc": l.target.value
        })
    },

    onColorChange: function(l) {
        this.setState({
            "color": l.target.value
        });
    },

    submit: function(e) {
        $(signal).trigger("danmakuSettingsRequest", this.state);
        e.preventDefault();
    },

    toBackground: function(e) {
        $(signal).trigger("toBackground");
        e.preventDefault();
    },

    toIframe: function(e) {
        $(signal).trigger("toIframe");
        e.preventDefault();
    },

    render: function() {
        var self = this;
        return(
            <div>
                <h1>Canvas Danmaku!</h1>
                <div id='form_wrap'>
                    <form id="contact-form">

                        <p id="formstatus"></p>
                        <label for="channel-url">CHANNEL URL: </label>
                        <input type="text" name="channel-url" id="channel-url" onChange={self.onChannelSrcChange} value={self.state.channelSrc} />
                        <label for="iframe-url">IFRAME URL: </label>
                        <input type="text" name="iframe-url" id="iframe-url" onChange={self.onIframeSrcChange} value={self.state.iframeSrc} />
                        <label for="font-size">FONT SIZE: </label>
                        <input type="text" name="font-size" id="font-size" onChange={self.onFontSizeChange} value={self.state.fontSize} />
                        <label for="danmaku-speed">DANMAKU SPEED: </label>
                        <input type="text" name="danmaku-speed" id="danmaku-speed" onChange={self.onSpeedChange} value={self.state.speed} />
                        <input type="text" name="danmaku-color" id="danmaku-color" onChange={self.onColorChange} value={self.state.color} />
                        <input type="submit" readOnly name="submit" value="OK I want to change my settings, thanks!" onClick={self.submit} />

                        <div style={{margin: "30px 0 0 0;"}}>
                            <input type="submit" readOnly onClick={self.toBackground} value="Show background" name="show-background" style={{float:"left", width: "225px"}} />
                            <input type="submit" readOnly onClick={self.toIframe} value="Show iframe" name="show-iframe" style={{float:"left", width: "175px"}} />

                        </div>
                    </form>
                </div>
            </div>
        );
    }
});

React.render(<SettingBar />, document.getElementById("react-wrap"));
