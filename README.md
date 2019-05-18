# @netless/react-tool-box

> 一个和 `netless` 白板的工具切换组件，可以在您的白板项目中直接使用，也可以参考其中的代码逻辑自己实现。

[![NPM](https://img.shields.io/npm/v/@netless/react-tool-box.svg)](https://www.npmjs.com/package/@netless/react-tool-box) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## 1. 说明

本项目技术选型为：`React` `Typescript `
打包工具为： `rollup`  

## 2. 安装

```bash
npm install --save @netless/react-tool-box

或者

yarn add @netless/react-tool-box
```

## 3. 接口说明

**自定义类型说明**

```typescript
export type Color = [number, number, number];
export type MemberState = {
    currentApplianceName: string;
    strokeColor: Color;
    strokeWidth: number;
    textSize: number;
};

export enum customerComponentPositionType {
    middle = "middle",
    end = "end",
    head = "head",
}
```

| 参数                       | 说明               | 类型                                         | 默认值 |
| :------------------------- | :----------------- | :------------------------------------------- | :----: |
| memberState                | 教具状态           | MemberState                                  |        |
| setMemberState             | 设置教具状态       | (modifyState: Partial<MemberState>) => void; |        |
| customerComponent?         | 三方按钮           | React.ReactNode[]                            |        |
| customerComponentPosition? | 三方按钮插入的位置 | customerComponentPositionType                |        |



## 4. 使用概览

```tsx
import * as React from "react";
import ToolBox from "@netless/react-tool-box";

export default class ToolBoxExample extends React.Component<{}, {}> 
  render () {
    return (
      <ToolBox
        // 用于教具条更新教具的状态
      	memberState={this.state.memberState}
        // 点击教具条可以更新教具
        setMemberState={this.setMemberState}
        // 在教具栏目中插入自定义的按钮，比如上次按钮
        customerComponent={[
          <UploadBtn/>,
        ]}/>
    )
  }
}
```

## 5. 启动项目测试案例

   后续补充

## 6. 项目截图

![react-tool-box-1](https://ohuuyffq2.qnssl.com/react-tool-box-1.png)

## License

MIT © [alwaysmavs](https://github.com/alwaysmavs)
