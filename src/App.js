import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import * as UiE from './UiElements.js';
import { Status, Quest } from './classes/Quest.js'
import * as Net from './classes/network.js'

const defualtUserID = 1;

function App() {
  const [isPopupOpen, setIsNewQPopupOpen] = useState(false);
  const openNewQPopup = () => setIsNewQPopupOpen(true);
  const closeNewQPopup = () => setIsNewQPopupOpen(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [resetFlag, setResetFlag] = useState(false);
  const [quests, setQuests] = useState([]);
  const [SidebarInputs, setSidebarInputs] = useState({
    title: '',
    status: '',
    description: '',
    parentId: '',
    ownerId: '',
    editorId: '',
  });

  //trigger initial fetch
  useEffect(() => {
    readByOwner(defualtUserID);
  }, []);

  useEffect(() => {
    setSelectedQuest(findQuestById(quests, selectedId));
  }, [quests, selectedId]);

  const addNewQuest = (newQuest) => {
    setQuests((prevQuests) => [...prevQuests, newQuest]);
  };

  const updateQuestInTree = (quests, updatedQuest) => {
  return quests.map((quest) => {
    if (quest.id === updatedQuest.id)
      return updatedQuest;
    if (quest.children && quest.children.length > 0) {
      const updatedChildren = updateQuestInTree(quest.children, updatedQuest);
      return { ...quest, children: updatedChildren };
    }
    return quest;
  });
};

  const resetSelectedQuest = () => {
    setResetFlag((prev) => !prev);
  };

  const handleSelectedQuestChange = (id, value) => {
    setSidebarInputs((prev) => {
      if (prev[id] === value) return prev;
      return {
        ...prev,
        [id]: value,
      };
    });
  };

  const changeSelectedQuest = () => {
    const updatedQuest = new Quest(
      selectedId,
      SidebarInputs.title !== '' ? SidebarInputs.title : selectedQuest?.title,
      SidebarInputs.description !== '' ? SidebarInputs.description : selectedQuest?.description,
      SidebarInputs.status !== '' ? SidebarInputs.status : selectedId?.status,
      SidebarInputs.parentId !== '' ? SidebarInputs.parentId : selectedQuest?.parentId,
      SidebarInputs.ownerId !== '' ? SidebarInputs.ownerId : selectedQuest?.ownerId,
      SidebarInputs.editorId !== '' ? SidebarInputs.editorId : selectedQuest?.editorId,
    );
    updateQuest(updatedQuest);
    {
      SidebarInputs.title = '';
      SidebarInputs.description = '';
      SidebarInputs.status = '';
      SidebarInputs.parentId = '';
      SidebarInputs.ownerId = '';
      SidebarInputs.editorId = '';
    }
  }

  const readByOwner = async (id) => {
    const data = await Net.readByOwner(id);
    if (data)
      data.forEach((q) => addNewQuest(Quest.fromJSON(q)));
  };

  const readByParent = async (id) => {
    const data = await Net.readByParent(id);
    let parentQuest = findQuestById(quests, id);
    if (!parentQuest.hasSubquests())
      data.forEach(subQuest => parentQuest.addSubquest(subQuest));
  }

  const createNewQuest = async (quest) => {
    quest.parentId = selectedId;
    console.log("createQuest: ", quest);
    const data = await Net.createNewQuest(quest);
    console.log(data);
    let parsedQuest = Quest.fromJSON(data, quests);
    if (!parsedQuest.hasParent())
      addNewQuest(parsedQuest);
    setQuests((prevQuests) => prevQuests.filter((quest) => quest.id !== selectedId));
  }

  const updateQuest = async (quest) => {
    const updateId = quest.id;
    const data = await Net.updateQuest(quest);
    let parsedQuest = Quest.fromJSON(data, quests);
    console.log("paresedQuest", parsedQuest);
    setQuests((prevQuests) => updateQuestInTree(prevQuests, parsedQuest));
    console.log(quests);
  }

  const deleteQuest = async (id) => {
    if (selectedId === null) return;
    const selId = selectedId;
    if (Net.deleteQuest(selId)) {
      setQuests((prevQuests) => prevQuests.filter((quest) => quest.id !== selId));
      setSelectedId(null);
      setSelectedQuest(null);
    }
  }

  return (
    <div className="app-container">
      {isPopupOpen && <UiE.NewQuestPopup isOpen={isPopupOpen} onClose={closeNewQPopup} createNew={createNewQuest} />}

      <div className="sidebar">
        <div className='listing-vertical-stretch' style={{ gap: 30 }}>
          <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 10, display: 'inline-flex' }}>
            <img src={logo} alt="Logo" />
            <div className="font-heading-1">SideQuest</div>
          </div>
          <div className='listing-vertical-stretch' style={{ gap: 15 }}>
            <UiE.IconTextButtonFill text="New Main Quest" id_="AddMainBtn" onClick={() => { setSelectedId(null); setSelectedQuest(null); openNewQPopup() }} />
            <UiE.SimpleDivider />
            <UiE.BasicLable text="Recents" />
            <div className="listing-vertical-stretch" style={{ gap: 10 }}>
              <UiE.IconTextButtonOutline text="QuestType" id_="QuestTypeBtn1" onClick={NotImpl} />
              <UiE.IconTextButtonOutline text="QuestType" id_="QuestTypeBtn2" onClick={NotImpl} />
            </div>
            <UiE.SimpleDivider />
            <UiE.BasicLable text="Common" />
            <div className="listing-vertical-stretch" style={{ gap: 10 }}>
              <UiE.IconTextButtonOutline text="QuestType" id_="QuestTypeBtn3" onClick={NotImpl} />
              <UiE.IconTextButtonOutline text="QuestType" id_="QuestTypeBtn4" onClick={NotImpl} />
              <UiE.IconTextButtonOutline text="QuestType" id_="QuestTypeBtn5" onClick={NotImpl} />
            </div>
          </div>
        </div>
        <div className='listing-vertical-stretch' style={{ gap: 15 }}>
          <UiE.SimpleDivider />
          <UiE.SidebarOption text="Settings" icon="settings" id_="SettingsBtn" onClick={NotImpl} />
          <UiE.SidebarOption text="Account" icon="account_circle" id_="AccountBtn" onClick={NotImpl} />
        </div>
      </div>

      <div className='center-elem'>
        <div className='font-heading-2'>Your Quests:</div>
        <QuestList quests={quests} setSelectedId={setSelectedId} selectedId={selectedId} />
      </div>

      <div className="sidebar" style={{ overflowY: 'auto' }}>
        <div className='listing-vertical-stretch' style={{ gap: 20 }}>
          <UiE.BasicTextField key={`${selectedQuest?.id || 'noQuest'}-${resetFlag}`} text={selectedQuest?.title || "-"} font_size={24} onChange={(_, value) => handleSelectedQuestChange('title', value)} padding_hor={10} padding_vert={5} id_="TitleInput" />
          <div className='listing-vertical-stretch' style={{ gap: 10 }}>
            {selectedQuest?.status !== 'done' ?
              <UiE.IconTextButtonOutline text="Complete" icon="check" content_alignment='center' id_="CompleteQBtn" onChange={(_, value) => handleSelectedQuestChange('status', Status.DONE)} />
              :
              <UiE.IconTextButtonOutline text="Reopen" icon="unpublished" content_alignment='center' id_="CompleteQBtn" onChange={(_, value) => handleSelectedQuestChange('status', Status.INITIAL)} />
            }
            <UiE.IconTextButtonOutline text="Add Subquest" icon="add" content_alignment='center' id_="AddSubQBtn" onClick={openNewQPopup} />
            <UiE.IconTextButtonOutline text="Delete" icon="delete" content_alignment='center' id_="DeleteQBtn" onClick={deleteQuest} />
          </div>
          <div className='labled-text-field'>
            <UiE.BasicLable text="Description" id_="DescriptionInput" />
            <UiE.LongTextField key={`${selectedQuest?.id || 'noQuest'}-${resetFlag}`} onChange={(_, value) => handleSelectedQuestChange('description', value)} text={selectedQuest?.description || "-"} />
          </div>
          <div className='labled-text-field'>
            <UiE.BasicLable text="Owner" />
            <UiE.BasicTextField key={`${selectedQuest?.id || 'noQuest'}-${resetFlag}`} onChange={(_, value) => handleSelectedQuestChange('ownderId', value)} text={selectedQuest?.ownerId || "-"} id_="OwnerInput" />
          </div>
          <div className='labled-text-field'>
            <UiE.BasicLable text="Editor" />
            <UiE.BasicTextField key={`${selectedQuest?.id || 'noQuest'}-${resetFlag}`} onChange={(_, value) => handleSelectedQuestChange('editorId', value)} text={selectedQuest?.editorId || "-"} id_="EditorInput" />
          </div>
        </div>
        <div className='labled-text-field'>
          <UiE.BasicLable text="Changes" />
          <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center', gap: 20, display: 'inline-flex' }}>
            <UiE.BasicTextButton text="Discard" id_="DiscardBtn" onClick={resetSelectedQuest} />
            <UiE.BasicTextButton text="Save" id_="SaveBtn" onClick={changeSelectedQuest} />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestList({ quests, setSelectedId, selectedId }) {
  const renderQuestItem = (quest) => {
    if (quest !== undefined)
      return (
        <UiE.QuestItem
          key={quest.id}
          quest={quest}
          is_selected={quest.id == selectedId}
          onClick={() => setSelectedId(quest.id)}>
          {quest.hasSubquests() && quest.subquests.map(renderQuestItem)}
        </UiE.QuestItem>
      );
    return null;
  }
  return <div className='quest-list'>{quests.map(renderQuestItem)}</div>;
}

function NotImpl() {
  alert("This feature is not implemented yet!");
  return null;
}

export function findQuestById(quests, id) {
  if (!id) return null;
  for (const quest of quests) {
    if (quest.id === id)
      return quest;
    if (quest.children) {
      const foundQuest = findQuestById(quest.children, id);
      if (foundQuest)
        return foundQuest;
    }
  }
  return null;
};

export default App;
