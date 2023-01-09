let paramsList = window.location.search.split('&') || [];
let params = {};
paramsList.forEach(function (paramSet, ind) {
    const paramSetSplit = paramSet.split('=');

    params[paramSetSplit[0].replace(/\?/g, '')] = paramSetSplit[1];
});

function debounce(callback, wait) {
    let timeOut;

    if (timeOut) {
        timeOut.clearTimeout();
    }

    return (args) => {
        timeout = setTimeout(function () {
            callback(args);
        }, wait);
    }; 
}

function setPushState(state = {}) {
    let pushState = location.pathname + '?';
    let queryParams = [`allowDuplicates=${state.allowDuplicates}`];
    Object.keys(state.parts).forEach(function (key) {
        queryParams.push(`${key}=${state.parts[key].ind}`);
    });

    pushState += queryParams.join('&');
    history.pushState({}, '', pushState);
}

const setPushStateDebounced = debounce((state) => setPushState(state), 100);

const inputTypes = [
    window.HTMLInputElement,
    window.HTMLSelectElement,
    window.HTMLTextAreaElement,
];

// Triggers the change in such a way that it ripples through React
function triggerInputChange(node, value = '') {
    // only process the change on elements we know have a value setter in their constructor
    if ( inputTypes.indexOf(node.__proto__.constructor) >-1 ) {

        const setValue = Object.getOwnPropertyDescriptor(node.__proto__, 'value').set;
        const event = new Event('change', { bubbles: true });

        setValue.call(node, value);
        node.dispatchEvent(event);

    }

}

// Using async/await allows for re-renders to happen.  This means that related dropdowns will have their items updated to accurately reflect what's disabled
async function randomOnClick() {
    let i = 1;
    let node;

    while (node = document.querySelector(`.js-part-selector-wrap:nth-of-type(${i}) .js-part-selector`)) {
        const len = node.options.length;
        const newInd = Math.floor(Math.random(new Date()) * len);

        await triggerInputChange(node, node.options[newInd].value);

        i++;
    }
}

const partLists = [
    {
        id: 'emitter',
        name: "Emitter",
        type: "emitter",
        partList: [
            {
                name: "Peace & Justice 2",
                url: "images/peace_justice_emitter_2.png"
            },
            {
                name: "Power & Control 1",
                url: "images/power_control_emitter_1.png"
            },
            {
                name: "Elemental Nature 2",
                url: "images/elemental_nature_emitter_2.png"
            }
        ]
    },
    {
        id: 'sleeve1',
        name: "Sleeve 1",
        type: "sleeve",
        checkDuplicates: true,
        matchingPart: "sleeve2",
        partList: [
            {
                name: "Peace & Justice 1",
                url: "images/peace_justice_sleeve_1.png"
            },
            {
                name: "Peace & Justice 2",
                url: "images/peace_justice_sleeve_2.png"
            },
            {
                name: "Peace & Justice 3",
                url: "images/peace_justice_sleeve_3.png"
            },
            {
                name: "Power & Control 1",
                url: "images/power_control_sleeve_1.png"
            },
            {
                name: "Power & Control 2",
                url: "images/power_control_sleeve_2.png"
            },
            {
                name: "Elemental Nature 1",
                url: "images/elemental_nature_sleeve_1.png"
            }
        ]
    },
    {
        id: 'switch',
        name: "Switch",
        type: "switch",
        partList: [
            {
                name: "Power & Control 1",
                url: "images/power_control_switch_1.png"
            }
        ]
    },
    {
        id: 'sleeve2',
        name: "Sleeve 2",
        type: "sleeve",
        checkDuplicates: true,
        matchingPart: "sleeve1",
        partList: [
            {
                name: "Peace & Justice 1",
                url: "images/peace_justice_sleeve_1.png"
            },
            {
                name: "Peace & Justice 2",
                url: "images/peace_justice_sleeve_2.png"
            },
            {
                name: "Peace & Justice 3",
                url: "images/peace_justice_sleeve_3.png"
            },
            {
                name: "Power & Control 1",
                url: "images/power_control_sleeve_1.png"
            },
            {
                name: "Power & Control 2",
                url: "images/power_control_sleeve_2.png"
            },
            {
                name: "Elemental Nature 1",
                url: "images/elemental_nature_sleeve_1.png"
            }
        ]
    },
    {
        id: 'pommel',
        name: "Pommel",
        type: "pommel",
        partList: [
            {
                name: "Peace & Justice 1",
                url: "images/peace_justice_pommel_1.png"
            },
            {
                name: "Peace & Justice 2",
                url: "images/peace_justice_pommel_2.png"
            },
            {
                name: "Power & Control 1",
                url: "images/power_control_pommel_1.png"
            },
            {
                name: "Elemental Nature 1",
                url: "images/elemental_nature_pommel_1.png"
            }
        ]
    }
];

class Dropdown extends React.Component {
    render() {
        const props = this.props
        let elem = [];
        try {
            elem = JSON.parse(props.elem);
        } catch (e) {
            // Not valid part, don't try and render
            return (<React.Fragment></React.Fragment>);
        }

        let options = [];

        elem.partList.forEach(function (part, ind) {
            const isDisabled = props.matchingPart && parseInt(props.matchingPart, 10) === ind
            if (!isDisabled) {
                const selected = parseInt(props.selected, 10) === ind;
                options.push(<option key={part.name} value={ind} selected={selected}>{part.name}</option>);
            }
        });

        return (<div className="c-lightsaber__part-selector-wrap js-part-selector-wrap">
                <label htmlFor={`lightsaber-${elem.id}-selector`}>
                    Select {elem.name}
                </label><br />
                <select className="c-lightsaber__part-selector js-part-selector" data-target={elem.id} onChange={(e) => { props.handler(e); }}>
                    {options}
                </select>
            </div>
        );
    }
}

class LightsaberPart extends React.Component {
    constructor(props) {
        super(props);

        let elem;
        try {
            elem = JSON.parse(this.props.elem);
        } catch (e) {
            // Not valid part
        }
        
        let state = {};

        if (elem) {
            state.elem = elem;
            state.partList = elem.partList;
        }

        this.state = state;
    }
    render() {
        const partList = this.state.partList;
        const part = partList[this.props.selected];
        if (part) {
            const elem = this.state.elem;
            return (<div className="c-lightsaber__part-wrap js-lightsaber-part-wrap">
                <img src={part.url} alt="" className={`c-lightsaber__part c-lightsaber__part--${elem.id}`} id={`lightsaber-${elem.id}`} />
            </div>);
        } else {
            return (<React.Fragment></React.Fragment>);
        }
    }
}
class App extends React.Component {
    constructor(props) {
        super(props);
        let state = { allowDuplicates: params.allowDuplicates === 'true', parts: {} };

        Object.keys(partLists).forEach(function (key) {
            const partList = partLists[key];
            state.parts[partList.id] = {
                ind: 0,
                matchingPart: partList.matchingPart || ''
            };
        });

        Object.keys(params).forEach(function (key) {
            if (state.parts[key]) { // Ignore any other "parts" that slipped in that aren't defined
                const param = params[key];
                let part = state.parts[key];
                part.ind = param;
            }
        });

        let keyItems = [];
        let parts = [];
        Object.keys(state.parts).forEach((key, ind) => {
            const part = state.parts[key];
            keyItems.push(`${key}-${part.ind}`);
            parts.push(<LightsaberPart elem={JSON.stringify(partLists[ind])} selected={state.parts[key].ind || 0} key={key}></LightsaberPart>);
        });

        state.compares = [];

        this.state = state;

        this.doCompare = this.doCompare.bind(this);
    }

    handleChange = (e) => {
        let state = this.state;
        let target = e.target;
        state.parts[target.dataset.target].ind = target.value;
        this.setState(state);
        setPushStateDebounced(state);
    }

    doCompare = (e) => {
        let state = this.state;
        let keyItems = [];
        let parts = [];
        Object.keys(state.parts).forEach((key, ind) => {
            const part = this.state.parts[key];
            keyItems.push(`${key}-${part.ind}`);
            parts.push(<LightsaberPart elem={JSON.stringify(partLists[ind])} selected={state.parts[key].ind || 0} key={key}></LightsaberPart>);
        });

        state.compares = state.compares.concat([(
            <div className="c-lightsaber js-lightsaber js-compare-lightsaber" data-test={JSON.stringify(state.parts)} key={keyItems.join('-')}>
                {parts}
                <button className="close js-close" data-target={keyItems.join('-')} onClick={ this.removeCompare }>Remove</button>
            </div>
        )]);

        this.setState(state);
    }

    removeCompare = (e) => {
        let state = this.state;
        const target = e.target.dataset.target;
        let compares = state.compares.filter( obj => {
            return obj.key !== target;
        });

        state.compares = compares;

        this.setState(state);
    }

    allowDuplicates = (e) => {
        let state = this.state;
        state.allowDuplicates = e.target.checked;

        this.setState(state);
        setPushStateDebounced(state);
    }

    render() {
        const state = this.state;
        let selectors = [];
        let parts = [];
        partLists.forEach((part) => {
            const statePart = state.parts[part.id];
            selectors.push(<Dropdown handler={this.handleChange.bind(this)} selected={statePart.ind || 0} elem={JSON.stringify(part)} key={part.id} 
                matchingPart={!state.allowDuplicates && statePart.matchingPart ? state.parts[statePart.matchingPart].ind : ''}></Dropdown>);
            parts.push(<LightsaberPart elem={JSON.stringify(part)} selected={statePart.ind || 0} key={part.id}></LightsaberPart>);
        });

        return (
            <React.Fragment>
                <h1>Custom Saber Builder</h1>
                <p>
                    Please note, this site is extremely incomplete at the moment.  It's not feature complete, it's not responsive, and it's not pretty.  
                </p>
                <div className="c-lightsaber js-lightsaber-builder">
                    {selectors}
                    {parts}
                </div>
                <button onClick={randomOnClick}>Randomize</button>
                <div className="form-group mb-3">
                    <input type="checkbox" id="allow-duplicates" className="js-allow-duplicates" value="true" onChange={this.allowDuplicates} checked={state.allowDuplicates} />
                    <label htmlFor="allow-duplicates">Allow Duplicates</label>
                </div>
                <button className="js-compare" onClick={this.doCompare}>Compare</button>
                {this.state.compares}
            </React.Fragment>
        );
    }
}

// npx babel --watch src --out-dir . --presets react-app/prod

ReactDOM.render(<App />, document.querySelector("#page"));