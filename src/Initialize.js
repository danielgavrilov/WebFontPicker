var stylesheet,
    Fonts,
    Styles,
    Picker;

$(function(){

    WFP.Stylesheet = stylesheet = new Stylesheet;
    WFP.Fonts = Fonts;
    WFP.Styles = Styles = new StyleList;
    WFP.Picker = Picker = new PickerView;

    document.body.appendChild(Picker.el);
    
});