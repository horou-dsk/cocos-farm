import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AtalsLabel')
export class AtalsLabel extends Component {
    private strMaps = [
        ['.', '1'],
        ['0', '2'],
        ['1', '3'],
        ['2', '4'],
        ['3', '5'],
        ['4', '6'],
        ['5', '7'],
        ['6', '8'],
        ['7', '9'],
        ['8', ':'],
        ['9', ';'],
        ['K', '<'],
        ['k', '<'],
    ]

    private _str = '';

    @property
    get str() {
        return this._str;
    }
    set str(v: string) {
        if (typeof v !== "string") {
            v = '114514';
        }
        this._str = v;
        this.mapToLabel();
    }

    private mapToLabel() {
        const label = this.getComponent(Label);
        if (label) {
            let newStr = '';
            for (let i = 0; i < this.str.length; i++) {
                const sm = this.strMaps.find(v => v[0] === this.str[i]);
                if (sm) {
                    newStr += sm[1];
                }
            }
            label.string = newStr;
        }
    }
}


