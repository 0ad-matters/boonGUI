class BoonGUIStatsModesRow {
    constructor(row, index) {
        const PREFIX = row.name;
        this.root = Engine.GetGUIObjectByName(PREFIX);
        this.root.size = BoonGUIGetRowSize(index, 40);
        this.indicator = Engine.GetGUIObjectByName(`${PREFIX}Indicator`);
        this.indicatorColor = Engine.GetGUIObjectByName(`${PREFIX}IndicatorColor`);
        this.indicatorLabel = Engine.GetGUIObjectByName(`${PREFIX}IndicatorLabel`);
        this.indicatorIcon = Engine.GetGUIObjectByName(`${PREFIX}IndicatorIcon`);
        this.itemsContainer = Engine.GetGUIObjectByName(`${PREFIX}Items`);
        this.items = this.itemsContainer.children.map((item, index) => new BoonGUIStatsModesRowItem(item, index));
        this.indicator.onPress = this.onPress.bind(this);
        this.state  = null;        
    }

    onPress() {
        if (this.state == null || this.state.civCentres.length <= 0) return;
        g_Selection.reset();
        g_Selection.addList(this.state.civCentres);
        let entState = GetEntityState(this.state.civCentres[0]);
        Engine.CameraMoveTo(entState.position.x, entState.position.z);
    }

    /**
     * @private
     */
    createTooltip(state) {
        let tooltip = "";
        const CivName = g_CivData[state.civ].Name;        
        tooltip += setStringTags(`${state.name}\n`, { color: state.playerColor });
        tooltip += setStringTags(`${CivName}\n`, { color: state.playerColor });
        tooltip += `${headerFont('Economy')} - Phase ${headerFont(state.phase)}\n`;

        const resTypes = ['food', 'wood', 'stone', 'metal'];

        
        for (let resType of resTypes) {
            const count = Math.floor(state.resourceCounts[resType])
            tooltip += `${resourceIcon(resType)} ${count} `;
        }
      
        return tooltip;
    }

    update(state, mode) {
        this.root.hidden = !state;
        this.state = state;
        if (!state) return;
        this.indicatorIcon.sprite = `stretched:${g_CivData[state.civ].Emblem}`;
        this.indicator.enabled = state.civCentres.length > 0;
        this.indicatorColor.sprite = `backcolor: ${state.playerColor}`;        
        this.indicatorLabel.caption = state.team != -1 ? `${state.team + 1}` : "";
        this.indicator.tooltip = this.createTooltip(state);

        const items = state.queue.filter(d => d.mode === mode)
        this.items.forEach((item, idx) => {
            item.update(items[idx], state);
        })
    }
}