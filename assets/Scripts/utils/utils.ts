import {Node, Component} from 'cc';

export function getParentByName(node: Node | Component, name: string): Node | null {
    if (node instanceof Component) {
        node = node.node;
    }
    let parent = node.getParent();
    while (parent) {
        if (parent.name === name) {
            return parent;
        }
        parent = parent.getParent();
    }
    return null;
}

const StrFormatRegex = /\{(\d)+\}/;

export function strFormat(str: string, ...texts: (string | number)[]): string {
    let _str = str;
    const arr = [];
    do {
        const tmp = _str.match(StrFormatRegex);
        if (tmp) {
            const ph = tmp[0];
            const head = _str.split(ph, 1)[0];
            _str = _str.substring(head.length + ph.length);
            const v = texts[Number(tmp[1])] ?? ph;
            if (head) arr.push(head, v);
            else arr.push(v);
        } else {
            arr.push(_str);
            break;
        }
    } while (true);

    return arr.join('');
}
