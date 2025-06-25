import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import * as UiE from './UiElements.js';

function App() {
  const quests = [
    {
      id: 1, title: "Quest 1", status: "initial", children: [{
        id: 2, title: "Quest 2", status: "done", parent_quest: 1, children: [{
          id: 3, title: "Quest 3", status: "done", parent_quest: 2, children: [{
            id: 7, title: "Quest 7", status: "done", parent_quest: 3, description: "smth"
          }, {
            id: 8, title: "Quest 8", status: "done", parent_quest: 3
          }, {
            id: 9, title: "Quest 9", status: "done", parent_quest: 3
          }, {
            id: 10, title: "Quest 10", status: "done", parent_quest: 3
          }]
        }]
      }, {
        id: 4, title: "Quest 4", status: "initial", parent_quest: 1
      }],
    }, {
      id: 5, title: "Quest 5", status: "initial", children: [{
        id: 6, title: "Quest 6", status: "done", parent_quest: 5
      }],
    },
  ];

  const [isPopupOpen, setIsNewQPopupOpen] = useState(false);
  const openNewQPopup = () => setIsNewQPopupOpen(true);
  const closeNewQPopup = () => setIsNewQPopupOpen(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedQuest, setSelectedQuest] = useState(null);

  const flattenQuests = (quests) => {
    let result = [];
    for (const quest of quests) {
      result.push(quest);
      if (quest.children) {
        result = result.concat(flattenQuests(quest.children));
      }
    }
    return result;
  };

  useEffect(() => {
    const allQuests = flattenQuests(quests);
    const quest = allQuests.find(q => q.id === selectedId);
    setSelectedQuest(quest);
  }, [selectedId]);

  return (
    <div className="app-container">
      {isPopupOpen && <UiE.NewQuestPopup isOpen={isPopupOpen} onClose={closeNewQPopup} />}

      <div className="sidebar">
        <div className='listing-vertical-stretch' style={{ gap: 30 }}>
          <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 10, display: 'inline-flex' }}>
            <img src={logo} alt="Logo" />
            <div className="font-heading-1">SideQuest</div>
          </div>
          <div className='listing-vertical-stretch' style={{ gap: 15 }}>
            <UiE.IconTextButtonFill text="New Main Quest" id_="AddMainBtn" onClick={openNewQPopup} />
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
        {QuestList(quests, setSelectedId, selectedId)}
        <UiE.SimpleDivider />
      </div>

      <div className="sidebar" style={{ overflowY: 'auto' }}>
        <div className='listing-vertical-stretch' style={{ gap: 20 }}>
          <UiE.BasicTextField key={selectedQuest?.id || 'noQuest'} text={selectedQuest?.title || "noTitle"} font_size={24} padding_hor={10} padding_vert={5} id_="TitleInput" />
          <div className='listing-vertical-stretch' style={{ gap: 10 }}>
            <UiE.IconTextButtonOutline text="Complete" icon="check" content_alignment='center' id_="CompleteQBtn" onClick={NotImpl} />
            <UiE.IconTextButtonOutline text="Add Subquest" icon="add" content_alignment='center' id_="AddSubQBtn" onClick={openNewQPopup} />
            <UiE.IconTextButtonOutline text="Delete" icon="delete" content_alignment='center' id_="DeleteQBtn" onClick={NotImpl} />
          </div>
          <div className='labled-text-field'>
            <UiE.BasicLable text="Description" id_="DescriptionInput" />
            <UiE.LongTextField key={selectedQuest?.id || 'noQuest'} text={selectedQuest?.description || "noDesc"} />
          </div>
          <div className='labled-text-field'>
            <UiE.BasicLable text="Owner" />
            <UiE.BasicTextField key={selectedQuest?.id || 'noQuest'} text={selectedQuest?.owner || "-"} id_="OwnerInput" />
          </div>
          <div className='labled-text-field'>
            <UiE.BasicLable text="Editor" />
            <UiE.BasicTextField key={selectedQuest?.id || 'noQuest'} text={selectedQuest?.editor || "-"} id_="EditorInput" />
          </div>
        </div>
        <div className='labled-text-field'>
          <UiE.BasicLable text="Changes" />
          <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center', gap: 20, display: 'inline-flex' }}>
            <UiE.BasicTextButton text="Discard" id_="DiscardBtn" onClick={NotImpl} />
            <UiE.BasicTextButton text="Save" id_="SaveBtn" onClick={NotImpl} />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestList(quests, setSelectedId, selectedId) {
  const handleSelect = (id) => setSelectedId(id);

  const renderQuestItem = (quest) => (
    <UiE.QuestItem
      key={quest.id}
      id_={quest.id}
      title={quest.title}
      status={quest.status}
      parent_quest={quest.parent_quest}
      is_selected={quest.id === selectedId}
      onClick={() => handleSelect(quest.id)}
    >
      {quest.children && quest.children.map(renderQuestItem)}
    </UiE.QuestItem>
  );

  return <div className='quest-list'>{quests.map(renderQuestItem)}</div>;
}

function NotImpl() {
  alert("This feature is not implemented yet!");
  return null;
}

export default App;
