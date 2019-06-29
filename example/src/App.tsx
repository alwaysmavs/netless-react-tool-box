import * as React from "react";
import ToolBox from "@netless/react-tool-box";
import "./App.less";
import {ToolBoxUpload} from "./ToolBoxUpload";

export type MemberStatType = {
    currentApplianceName: string,
    strokeColor: number[],
    strokeWidth: number,
    textSize: number,
};

export type AppStates = {
    memberState: MemberStatType;
    toolBoxColor: string;
};

export default class App extends React.Component<{}, AppStates> {

    public constructor(props: {}) {
        super(props);
        this.state = {
            memberState: {
                currentApplianceName: "ellipse",
                strokeColor: [236, 52, 85],
                strokeWidth: 4,
                textSize: 16,
            },
            toolBoxColor: "#A2A7AD",
        };
    }

    private renderBtn = (): React.ReactNode => {
        return (
            <div
                onMouseEnter={() => this.setState({toolBoxColor: "#141414"})}
                onMouseLeave={() => this.setState({toolBoxColor: "#A2A7AD"})}
                className="tool-box-cell-box">
                <div className="tool-box-cell">
                    <ToolBoxUpload color={this.state.toolBoxColor}/>
                </div>
            </div>
        );
    }

    public render(): React.ReactNode {
        return (
            <div className="container">
                <ToolBox customerComponent={[this.renderBtn()]} memberState={this.state.memberState} setMemberState={() => {}} isMobile={false}/>
            </div>
        );
    }
}
