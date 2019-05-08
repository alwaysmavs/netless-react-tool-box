import * as React from "react";
import {StrokeWidth} from "./ToolIconComponent";
import toolPaletteConfig from "./ToolPaletteConfig";
import ToolBoxPaletteBoxStyles from "./ToolBoxPaletteBox.less";
export type ToolBoxPaletteBoxProps = {
    displayStroke: boolean;
    setMemberState: (modifyState: Partial<any>) => void;
    memberState: Readonly<any>;
};

export default class ToolBoxPaletteBox extends React.Component<ToolBoxPaletteBoxProps, {}> {

    public constructor(props: ToolBoxPaletteBoxProps) {
        super(props);
        this.state = {};
    }

    private setStrokeWidth(event: Event): void {
        const strokeWidth = parseInt((event.target as any).value);
        this.props.setMemberState({strokeWidth: strokeWidth});
    }

    public render(): React.ReactNode {
        return (
            <div className={ToolBoxPaletteBoxStyles["palette-mid-box"]}>
                {this.renderColorSelector()}
                {this.props.displayStroke && this.renderStrokeSelector()}
            </div>
        );
    }

    private renderColorSelector(): React.ReactNode {
        return [
            <div key="title" className={ToolBoxPaletteBoxStyles["palette-title-one"]}>
                Color
            </div>,
            <div key="cells" className={ToolBoxPaletteBoxStyles["palette-color-box"]}>
                {toolPaletteConfig.map((cell, index) => {
                    const className = this.isMatchColor(cell.color) ? ToolBoxPaletteBoxStyles["palette-color-inner-box-active"]
                                                                    : ToolBoxPaletteBoxStyles["palette-color-inner-box"];
                    const [r, g, b] = cell.color;

                    return (
                        <div className={className}
                             key={`${index}`}
                             onClick={() => this.props.setMemberState({strokeColor: cell.color})}>
                            <div className={ToolBoxPaletteBoxStyles["palette-color"]}
                                 style={{backgroundColor: `rgb(${r},${g},${b})`}}/>
                        </div>
                    );
                })}
            </div>,
        ];
    }

    private isMatchColor(color: any): boolean {
        const {strokeColor} = this.props.memberState;
        return (
            strokeColor[0] === color[0] &&
            strokeColor[1] === color[1] &&
            strokeColor[2] === color[2]
        );
    }

    private renderStrokeSelector(): React.ReactNode {
        const [r, g, b] = this.props.memberState.strokeColor;
        return [
            <div key="title" className={ToolBoxPaletteBoxStyles["palette-title-two"]}>Thickness</div>,
            <div key="box" className={ToolBoxPaletteBoxStyles["palette-stroke-width-box"]}>
                <StrokeWidth
                    className={ToolBoxPaletteBoxStyles["palette-stroke-under-layer"]}
                    color={`rgb(${r},${g},${b})`}/>

                <div className={ToolBoxPaletteBoxStyles["palette-stroke-slider-mask"]}>
                    <input className={ToolBoxPaletteBoxStyles["palette-stroke-slider"]}
                           type="range"
                           min={2}
                           max={32}
                           onChange={this.setStrokeWidth.bind(this)}
                           defaultValue={`${this.props.memberState.strokeWidth}`}
                           onMouseUp={
                               () => this.props.setMemberState({strokeWidth: this.props.memberState.strokeWidth})
                           }/>
                </div>
            </div>,
        ];
    }
}
