function importTemplate(template, vars) {
    let clone = document.importNode(template.content, true);
    const regex = /\$([^$]*)\$/g;
    let matches;
    let couldChangeAttr = clone.querySelectorAll('.ns-template-var-attr');
    for (let element of couldChangeAttr) {
        for (let attr of element.getAttributeNames()) {
            let value = element.getAttribute(attr);
            let new_value = value;
            while (matches = regex.exec(value)) {
                if (vars[matches[1]]) {
                    new_value = new_value.replace(matches[0], vars[matches[1]]);
                }
                element.setAttribute(attr, new_value);
            }
        }
    }
    return clone;
}

function setupCategoryContainer(data) {

    const raw = data.rawData;
    const container = _("#category-container");
    const templateC = _("#category-template");
    const templateT = _("#category-template-topic");
    for (const cat in raw) {
        const clone = importTemplate(templateC, {"id": cat});
        const topicContainer = clone.querySelector('.ns-category-topic-container');
        for (const topic in raw[cat]["topics"]) {
            const cloneTopic = importTemplate(templateT, {"id": cat, "topic": topic.toString()});
            topicContainer.appendChild(cloneTopic);
            console.log(topicContainer);
        }
        container.appendChild(clone);
    }
}

const categoryContainerData = _('#category-container-data');

if (categoryContainerData) {
    if (categoryContainerData.dataLoad) setupCategoryContainer(categoryContainerData);
    categoryContainerData.addEventListener('dataLoad', () => {setupCategoryContainer(categoryContainerData)});
}