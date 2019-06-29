import * as React from "react";
import TweenOne from "rc-tween-one";
import Popover from "antd/lib/popover";
import "antd/lib/popover/style";
import ToolBoxPaletteBox from "./ToolBoxPaletteBox";
import {
    IconProps,
    ToolBoxEllipse,
    ToolBoxEraser,
    ToolBoxPencil, ToolBoxRectangle,
    ToolBoxSelector,
    ToolBoxText,
} from "./ToolIconComponent";
import ToolBoxStyles from "./ToolBox.less";
import ToolBoxPaletteBoxMobile from "./ToolBoxPaletteBoxMobile";

type ApplianceDescription = {
    readonly iconView: React.ComponentClass<IconProps>;
    readonly hasColor: boolean;
    readonly hasStroke: boolean;
};

export enum customerComponentPositionType {
    middle = "middle",
    end = "end",
    head = "head",
}
export type Color = number[];
export type MemberState = {
    currentApplianceName: string;
    strokeColor: Color;
    strokeWidth: number;
    textSize: number;
};
export type ToolBoxProps = {
    memberState: Readonly<MemberState>;
    setMemberState: (modifyState: Partial<MemberState>) => void;
    isMobile?: boolean;
    customerComponent?: React.ReactNode[];
    customerComponentPosition?: customerComponentPositionType;
};

export type ToolBoxStates = {
    isPaletteBoxAppear: boolean;
    strokeEnable: boolean;
    isToolBoxSwitched: boolean;
    extendsPanel: boolean;
    windowHeight: number;
};

export default class ToolBox extends React.Component<ToolBoxProps, ToolBoxStates> {
    private static readonly descriptions: {readonly [applianceName: string]: ApplianceDescription} = Object.freeze({
        selector: Object.freeze({
            iconView: ToolBoxSelector,
            hasColor: false,
            hasStroke: false,
        }),
        pencil: Object.freeze({
            iconView: ToolBoxPencil,
            hasColor: true,
            hasStroke: true,
        }),
        text: Object.freeze({
            iconView: ToolBoxText,
            hasColor: true,
            hasStroke: false,
        }),
        eraser: Object.freeze({
            iconView: ToolBoxEraser,
            hasColor: false,
            hasStroke: false,
        }),
        ellipse: Object.freeze({
            iconView: ToolBoxEllipse,
            hasColor: true,
            hasStroke: true,
        }),
        rectangle: Object.freeze({
            iconView: ToolBoxRectangle,
            hasColor: true,
            hasStroke: true,
        }),
    });

    public constructor(props: ToolBoxProps) {
        super(props);
        this.state = {
            isPaletteBoxAppear: false,
            strokeEnable: false,
            isToolBoxSwitched: false,
            extendsPanel: false,
            windowHeight: 0,
        };
    }

    public clickAppliance = (event: Event | undefined, applianceName: string): void => {
        event!.preventDefault();
        const isSelected = this.props.memberState.currentApplianceName === applianceName;
        if (isSelected) {
            this.setState({isToolBoxSwitched: false, extendsPanel: !this.state.extendsPanel});
        } else {
            this.setState({isToolBoxSwitched: true, isPaletteBoxAppear: false});
            this.props.setMemberState({currentApplianceName: applianceName});
            this.setState({extendsPanel: false});
        }
    }

    public componentWillMount(): void {
        this.setState({extendsPanel: false, windowHeight: window.innerHeight});
    }

    private onVisibleChange = (visible: boolean): void => {
        if (!visible) {
            this.setState({extendsPanel: false});
        }
    }

    private buttonColor(isSelected: boolean): string {
        if (isSelected) {
            const [r, g, b] = this.props.memberState.strokeColor;
            return `rgb(${r},${g},${b})`;
        } else {
            return "rgb(162,167,173)";
        }
    }

    private addCustomerComponent = (nodes: React.ReactNode[]): React.ReactNode[] => {
        const position = this.props.customerComponentPosition;
        if (this.props.customerComponent) {
            const appendPositionNumber: number = Math.floor((nodes.length / 2));
            const customerNodes = this.props.customerComponent.map((data: React.ReactNode, index: number) => {
                return <div key={`tool-customer-${index}`}>{data}</div>;
            });
            if (position) {
                if (position === customerComponentPositionType.head) {
                    nodes.splice(0, 0, [...customerNodes]);
                    return nodes;
                } else if (position === customerComponentPositionType.end) {
                    nodes.splice(nodes.length, 0, [...customerNodes]);
                    return nodes;
                }
            }
            nodes.splice(appendPositionNumber, 0, [...customerNodes]);
            return nodes;
        } else {
            return nodes;
        }
    }

    public render(): React.ReactNode {
        const {isMobile} = this.props;
        const nodes: React.ReactNode[] = [];
        for (const applianceName in ToolBox.descriptions) {
            const description = ToolBox.descriptions[applianceName];
            let node: React.ReactNode;
            if (isMobile) {
                node = this.renderApplianceButtonMobile(applianceName, description);
            } else {
                node = this.renderApplianceButton(applianceName, description);
            }
            nodes.push(node);
        }
        if (isMobile) {
            return [
                <ToolBoxPaletteBoxMobile
                    key={"tool-box-palette"}
                    isPaletteBoxAppear={this.state.isPaletteBoxAppear}
                    isToolBoxSwitched={this.state.isToolBoxSwitched}
                    memberState={this.props.memberState}
                    setMemberState={this.props.setMemberState}
                    strokeEnable={this.state.strokeEnable}/>,
                <div key={"tool-box-h5"} className={ToolBoxStyles["tool-box-h5"]}>
                    <div
                        className={ToolBoxStyles["tool-mid-box-h5"]}>
                        {this.addCustomerComponent(nodes)}
                    </div>
                </div>,
            ];
        } else {
            return (
                <div className={ToolBoxStyles["tool-box"]}>
                    <div className={ToolBoxStyles["tool-mid-box"]}>
                        {this.addCustomerComponent(nodes)}
                    </div>
                </div>
            );
        }
    }

    private renderApplianceButtonMobile(applianceName: string, description: ApplianceDescription): React.ReactNode {
        const ToolIcon = description.iconView;
        const state = this.props.memberState;
        const isExtendable = description.hasStroke || description.hasColor;
        const isSelected = state.currentApplianceName === applianceName;
        const buttonColor = this.buttonColor(isSelected);

        const cellBox: React.ReactNode = (
            <div className={ToolBoxStyles["tool-box-cell-box-h5"]} key={applianceName}>
                <div className={ToolBoxStyles["tool-box-cell-h5"]}
                     onClick={() => this.clickAppliance(event, applianceName)}>
                    <ToolIcon color={buttonColor}/>
                </div>
                {isExtendable && isSelected && (
                    <TweenOne className={ToolBoxStyles["tool-box-cell-step-two"]}
                              animation={{
                                  duration: 150,
                                  delay: 100,
                                  width: 8,
                                  backgroundColor: buttonColor,
                                  display: isSelected ? "flex" : "none",
                              }}
                              style={{
                                  backgroundColor: buttonColor,
                                  width: 0,
                                  display: "none",
                              }}/>
                )}
            </div>
        );

        if (isExtendable && isSelected) {
            return (
                <div key={applianceName} onClick={() => this.setToolBoxPaletteBoxState(isSelected, description)}>
                    {cellBox}
                </div>
            );
        } else {
            return cellBox;
        }
    }
    private setToolBoxPaletteBoxState = (isSelected: boolean, description: ApplianceDescription): void => {
        if (isSelected && this.state.extendsPanel) {
            this.setState({isPaletteBoxAppear: true, strokeEnable: description.hasStroke});
        } else {
            this.setState({isPaletteBoxAppear: false});
        }
    }
    private renderApplianceButton(applianceName: string, description: ApplianceDescription): React.ReactNode {
        const ToolIcon = description.iconView;
        const state = this.props.memberState;
        const isExtendable = description.hasStroke || description.hasColor;
        const isSelected = state.currentApplianceName === applianceName;
        const buttonColor = this.buttonColor(isSelected);

        const cellBox: React.ReactNode = (
            <div className={ToolBoxStyles["tool-box-cell-box"]} key={applianceName}>
                <div className={ToolBoxStyles["tool-box-cell"]}
                     onClick={() => this.clickAppliance(event, applianceName)}>
                    <ToolIcon color={buttonColor}/>
                </div>
                {isExtendable && isSelected && (
                    <TweenOne className={ToolBoxStyles["tool-box-cell-step-two"]}
                              animation={{
                                  duration: 150,
                                  delay: 100,
                                  width: 8,
                                  backgroundColor: buttonColor,
                                  display: isSelected ? "flex" : "none",
                              }}
                              style={{
                                  backgroundColor: buttonColor,
                                  width: 0,
                                  display: "none",
                              }}/>
                )}
            </div>
        );
        if (isExtendable && isSelected) {
            return (
                <Popover key={applianceName}
                         visible={this.state.extendsPanel}
                         trigger="click"
                         placement="bottom"
                         onVisibleChange={this.onVisibleChange}
                         content={this.renderToolBoxPaletteBox(isSelected, description)}>
                    {cellBox}
                </Popover>
            );
        } else {
            return cellBox;
        }
    }

    private renderToolBoxPaletteBox(isSelected: boolean, description: ApplianceDescription): React.ReactNode {
        if (isSelected && this.state.extendsPanel) {
            return <ToolBoxPaletteBox
                memberState={this.props.memberState}
                setMemberState={this.props.setMemberState}
                displayStroke={description.hasStroke}/>;
        }
        return null;
    }
}
