function doClick(e) {
    alert($.label.text);
}

$.index.open();
var items = [
	{properties: {title: "Music 1"}},
	{properties: {title: "Music 2"}},
	{properties: {title: "Music 3"}}
];
$.songsList.sections[0].setItems(items);

