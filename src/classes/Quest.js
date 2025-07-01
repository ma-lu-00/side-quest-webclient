import { findQuestById } from "../App";

const Status = Object.freeze({
    INITIAL: 'initial',
    DONE: 'done',
    INACTIVE: 'inactive'
});

export { Status };


class Quest {
    constructor(id, title, description, status, parentId, ownerId, editorId, subquests = []) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status || Status.INITIAL;
        this.parentId = parentId || null;
        this.parent = null;
        this.ownerId = ownerId;
        this.owner = null;
        this.editorId = editorId;
        this.editor = null;
        this.subquests = Array.isArray(subquests) ? subquests : [];
    }

    getStatus() {
        return this.status;
    }

    addSubquest(subquest) {
        if (subquest instanceof Quest) {
            this.subquests.push(subquest);
            subquest.setParent(this);
        } else {
            console.error("Invalid subquest.");
        }
    }

    getParentId() {
        return this.parentId ? this.parentId : "No parent ID";
    }

    getParent() {
        return this.parent ? this.parent : "No parent";
    }

    hasParent() {
        return this.parent !== null;
    }

    setParent(parentQuest) {
        if (parentQuest instanceof Quest) {
            this.parent = parentQuest;
            this.parentId = parentQuest.id;
        } else {
            console.error("Invalid parent quest.");
        }
    }

    hasSubquests() {
        return this.subquests.length != 0;
    }

    toJSON() {
        const data = {
            title: this.title,
            description: this.description,
            status: this.status,
            parent: this.parentId || null,
            owner: this.ownerId || null,
            editor: this.editorId || null
        };

        if (this.id != null)
            data.id = this.id;

        return JSON.stringify(data);
    }

    static fromJSON(jsonData, allQuests) {
        const quest = new Quest(
            jsonData.id,
            jsonData.title,
            jsonData.description,
            jsonData.status,
            jsonData.parent,
            jsonData.owner,
            jsonData.editor
        );

        const parent = findQuestById(allQuests, quest.parentId);
        if (parent)
            quest.setParent(parent);

        if (jsonData.subquests && Array.isArray(jsonData.subquests)) {
            quest.subquests = jsonData.subquests.map(subquestData => Quest.fromJSON(subquestData, allQuests));
        }

        return quest;
    }
}

export { Quest };