import * as React from "react";
import TweenOne from "rc-tween-one";
import toolPaletteConfig from "./ToolPaletteConfig";
import {Color, MemberState} from "./index";
import ToolBoxPaletteBoxMobileStyle from "./ToolBoxPaletteBoxMobile.less";
import palette_arrow from "./palette_arrow.svg";

export type ToolBoxPaletteBoxProps = {
    strokeEnable: boolean,
    isPaletteBoxAppear: boolean,
    setMemberState: (modifyState: Partial<MemberState>) => void;
    memberState: Readonly<MemberState>;
    isToolBoxSwitched: boolean;
};
export type ToolBoxMobileType = {
    name: string,
    color: any,
    stokeState: StrokeWidthSize;
};

export type ToolBoxPaletteBoxStates = {
    toolBoxMobileState: ToolBoxMobileType[];
};

export type StrokeWidthStyle = {
    width: number,
    height: number,
};

export enum StrokeWidthSize {
    small = "small",
    middle = "middle",
    big = "big",
}

export default class ToolBoxPaletteBoxMobile extends React.Component<ToolBoxPaletteBoxProps, ToolBoxPaletteBoxStates> {

    private readonly strokeSmall: number = 6;
    private readonly strokeMiddle: number = 8;
    private readonly strokeBig: number = 10;
    private readonly strokeOutBoxDifferenceWidth: number = 4;

    public constructor(props: ToolBoxPaletteBoxProps) {
        super(props);
        const toolPaletteArray = toolPaletteConfig.map(data => {
            return {
                name: data.name,
                color: data.color,
                stokeState: StrokeWidthSize.small,
            };
        });
        this.state = {
            toolBoxMobileState: toolPaletteArray,
        };
        this.getStrokeWidthNumber = this.getStrokeWidthNumber.bind(this);
        this.strokeWidthInnerStyle = this.strokeWidthInnerStyle.bind(this);
        this.strokeWidthOutStyle = this.strokeWidthOutStyle.bind(this);
        this.uploadToolBoxMobileState = this.uploadToolBoxMobileState.bind(this);
        this.resetToolBoxMobileState = this.resetToolBoxMobileState.bind(this);
        this.getStrokeWidthSize = this.getStrokeWidthSize.bind(this);
        this.renderPaletteArrow = this.renderPaletteArrow.bind(this);
    }

    private getStrokeWidthNumber(strokeWidthSize: StrokeWidthSize): number {
        switch (strokeWidthSize) {
            case StrokeWidthSize.small:
                return this.strokeSmall;
            case StrokeWidthSize.middle:
                return this.strokeMiddle;
            case StrokeWidthSize.big:
                return this.strokeBig;
        }
    }

    private getStrokeWidthSize(strokeWidthNumber: number): StrokeWidthSize {
        switch (strokeWidthNumber) {
            case this.strokeSmall:
                return StrokeWidthSize.small;
            case this.strokeMiddle:
                return StrokeWidthSize.middle;
            case this.strokeBig:
                return StrokeWidthSize.big;
            default:
                return StrokeWidthSize.small;
        }
    }

    private uploadToolBoxMobileState(name: string, strokeWidthSize: StrokeWidthSize): void {
        const nextToolBoxMobileState = this.state.toolBoxMobileState.map(data => {
            if (data.name === name) {
                data.stokeState = strokeWidthSize;
                this.props.setMemberState({strokeWidth: this.getStrokeWidthNumber(data.stokeState)});
            }
            return data;
        });
        this.setState({toolBoxMobileState: nextToolBoxMobileState});
    }

    private resetToolBoxMobileState(): void {
        const nextToolBoxMobileState = this.state.toolBoxMobileState.map(data => {
            data.stokeState = StrokeWidthSize.small;
            return data;
        });
        this.setState({toolBoxMobileState: nextToolBoxMobileState});
        this.props.setMemberState({strokeWidth: this.strokeSmall});
    }

    public shouldComponentUpdate(nextProps: ToolBoxPaletteBoxProps, nextState: ToolBoxPaletteBoxStates): boolean {
        if (this.props.isPaletteBoxAppear !== nextProps.isPaletteBoxAppear) {
            if (nextProps.strokeEnable) {
                const initToolBoxMobileState = this.state.toolBoxMobileState.map(data => {
                    if (this.isMatchColor(data.color)) {
                        data.stokeState = this.getStrokeWidthSize(this.props.memberState.strokeWidth);
                    }
                    return data;
                });
                this.setState({toolBoxMobileState: initToolBoxMobileState});
            } else {
                this.resetToolBoxMobileState();
            }
            return true;
        } else if (this.state.toolBoxMobileState !== nextState.toolBoxMobileState) {
            return true;
        } else {
            return false;
        }
    }
    public componentDidMount (): void {
        const initToolBoxMobileState = this.state.toolBoxMobileState.map(data => {
            if (this.isMatchColor(data.color)) {
                data.stokeState = this.getStrokeWidthSize(this.props.memberState.strokeWidth);
            }
            return data;
        });
        this.setState({toolBoxMobileState: initToolBoxMobileState});
    }

    private setStrokeWidth(cell: ToolBoxMobileType): void {
        if (!this.props.isToolBoxSwitched) {
            switch (cell.stokeState) {
                case StrokeWidthSize.small:
                    this.uploadToolBoxMobileState(cell.name, StrokeWidthSize.middle);
                    break;
                case StrokeWidthSize.middle:
                    this.uploadToolBoxMobileState(cell.name, StrokeWidthSize.big);
                    break;
                case StrokeWidthSize.big:
                    this.uploadToolBoxMobileState(cell.name, StrokeWidthSize.small);
                    break;
            }
        } else {
            this.resetToolBoxMobileState();
        }
    }

    private strokeWidthInnerStyle(strokeWidthSize: StrokeWidthSize): StrokeWidthStyle {
        switch (strokeWidthSize) {
            case StrokeWidthSize.small:
                return {width: this.strokeSmall, height: this.strokeSmall};
            case StrokeWidthSize.middle:
                return {width: this.strokeMiddle, height: this.strokeMiddle};
            case StrokeWidthSize.big:
                return {width: this.strokeBig, height: this.strokeBig};
        }
    }

    private strokeWidthOutStyle(strokeWidthSize: StrokeWidthSize): StrokeWidthStyle {
        switch (strokeWidthSize) {
            case StrokeWidthSize.small:
                return {
                    width: this.strokeSmall + this.strokeOutBoxDifferenceWidth,
                    height: this.strokeSmall + this.strokeOutBoxDifferenceWidth,
                };
            case StrokeWidthSize.middle:
                return {
                    width: this.strokeMiddle + this.strokeOutBoxDifferenceWidth,
                    height: this.strokeMiddle + this.strokeOutBoxDifferenceWidth,
                };
            case StrokeWidthSize.big:
                return {
                    width: this.strokeBig + this.strokeOutBoxDifferenceWidth,
                    height: this.strokeBig + this.strokeOutBoxDifferenceWidth,
                };
        }
    }


    public render(): React.ReactNode {
        return (
            <TweenOne
                animation={{
                    duration: 120,
                    bottom: 76,
                    opacity: 1,
                    display: "flex",
                }}
                reverse={!this.props.isPaletteBoxAppear}
                style={{
                    bottom: 56,
                    opacity: 0,
                    display: "none",
                }}
                className={ToolBoxPaletteBoxMobileStyle["tool-box-palette-h5"]}>
                <div className={ToolBoxPaletteBoxMobileStyle["palette-mid-box-h5"]}>
                    {this.renderColorSelector()}
                </div>
            </TweenOne>
        );
    }

    private renderPaletteArrow(index: number): React.ReactNode {
        const {memberState} = this.props;
        if (memberState.currentApplianceName === "pencil" && index === 1) {
            return (
                <div className={ToolBoxPaletteBoxMobileStyle["palette-color-touch-box-h5-arrow"]}>
                    <img src={palette_arrow}/>
                </div>
            );
        } else if (memberState.currentApplianceName === "text" && index === 2) {
            return (
                <div className={ToolBoxPaletteBoxMobileStyle["palette-color-touch-box-h5-arrow"]}>
                    <img src={palette_arrow}/>
                </div>
            );
        } else if (memberState.currentApplianceName === "ellipse" && index === 5) {
            return (
                <div className={ToolBoxPaletteBoxMobileStyle["palette-color-touch-box-h5-arrow"]}>
                    <img src={palette_arrow}/>
                </div>
            );
        } else if (memberState.currentApplianceName === "rectangle" && index === 6) {
            return (
                <div className={ToolBoxPaletteBoxMobileStyle["palette-color-touch-box-h5-arrow"]}>
                    <img src={palette_arrow}/>
                </div>
            );
        } else {
            return null;
        }
    }

    private renderColorSelector(): React.ReactNode {
        return (
            <div key="cells" className={ToolBoxPaletteBoxMobileStyle["palette-color-box-h5"]}>
                {this.state.toolBoxMobileState.map((cell, index) => {
                    const className = this.isMatchColor(cell.color) ? ToolBoxPaletteBoxMobileStyle["palette-color-inner-box-active-h5"]
                        : ToolBoxPaletteBoxMobileStyle["palette-color-inner-box-h5"];
                    const [r, g, b] = cell.color;
                    return (
                        <div  key={`${index}`} className={ToolBoxPaletteBoxMobileStyle["palette-color-touch-box-out-h5"]}>
                            <div
                                className={ToolBoxPaletteBoxMobileStyle["palette-color-touch-box-h5"]}
                                onClick={() => {
                                    if (this.isMatchColor(cell.color)) {
                                        if (this.props.strokeEnable) {
                                            this.setStrokeWidth(cell);
                                        } else {
                                            this.resetToolBoxMobileState();
                                        }
                                    } else {
                                        this.resetToolBoxMobileState();
                                    }
                                    this.props.setMemberState({strokeColor: cell.color});
                                }}>
                                <div
                                    style={{
                                        ...this.strokeWidthOutStyle(cell.stokeState),
                                        borderColor: `rgb(${r},${g},${b})`,
                                    }}
                                    className={className}>
                                    <div className={ToolBoxPaletteBoxMobileStyle["palette-color-h5"]}
                                         style={{
                                             backgroundColor: `rgb(${r},${g},${b})`,
                                             ...this.strokeWidthInnerStyle(cell.stokeState),
                                         }}/>
                                </div>
                            </div>
                            {this.renderPaletteArrow(index)}
                        </div>
                    );
                })}
            </div>
        );
    }

    private isMatchColor(color: Color): boolean {
        const {strokeColor} = this.props.memberState;
        return (
            strokeColor[0] === color[0] &&
            strokeColor[1] === color[1] &&
            strokeColor[2] === color[2]
        );
    }
}
