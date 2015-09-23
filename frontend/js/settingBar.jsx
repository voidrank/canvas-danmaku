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
            "iframeSrc" : ""
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
    submit: function() {
        $(signal).trigger("danmakuSettingsRequest", this.state);
    },
    render: function() {
        var self = this;
        return(
            <div id="settingBar">
                <div className="element-wrapper title">SETTINGS</div>
                <div className="element-wrapper">
                    <input id="iframe-src" className="input" placeholder="iframe-src"
                        value={self.state.iframeSrc} onChange={self.onIframeSrcChange} />
                </div>
                <div className="element-wrapper">
                    <input id="channel-src" className="input" placeholder="channel-src"
                           value={self.state.channelSrc} onChange={self.onChannelSrcChange} />
                </div>
                <div className="element-wrapper">
                    <input id="font-size" className="input" placeholder="font-size"
                        value={self.state.fontSize} onChange={self.onFontSizeChange} />
                </div>
                <div className="element-wrapper">
                    <input id="speed" className="input" placeholder="speed"
                        value={self.state.speed} onChange={self.onSpeedChange} />
                </div>
                <div className="element-wrapper submit-wrapper">
                    <input type="submit" className="submit" onClick={self.submit} value="SUBMIT" />
                </div>
            </div>
        );
    }
});

React.render(<SettingBar />, document.getElementById("settingBarWrapper"));
