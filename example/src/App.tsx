import * as React from "react";
import ToolBox from "@netless/react-tool-box";
import "./App.less";


export default class App extends React.Component<{}, {}> {

    public constructor(props: {}) {
        super(props);
        this.state = {
        };
    }


    public async componentDidMount(): Promise<void> {

    }

    // private getSlider(): React.ReactNode {
    //     return <ToolBox />;
    // }

    public render(): React.ReactNode {
        return (
            <div className="container">
                <h1>React top loading bar</h1>
                {/*{this.getSlider()}*/}
            </div>
        );
    }
}
