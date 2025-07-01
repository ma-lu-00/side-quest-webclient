import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { Quest, Status } from './classes/Quest.js'
import * as Net from './classes/network.js'

export const QuestItem = ({ quest, is_selected = false, onClick, children }) => {
    const indent_witdh = 46;

    const [isExpanded, setIsExpanded] = useState(false);
    const toggleChildren = () => {
        setIsExpanded(prev => !prev);
    };

    return (
        <div className='quest-list'>
            <div style={{ width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 0, display: 'flex', boxSizing: 'border-box' }}
                {...(quest.id ? { id: quest.id } : {})}>
                {quest.hasParent() && <MaterialIcon icon='subdirectory_arrow_right' style={{ paddingLeft: `${(quest.hasParent() && indent_witdh / 2)}px`, }} />}
                <div className='quest-item' style={{ background: is_selected === true && 'var(--light-color)' }} onClick={onClick} >
                    {quest.hasSubquests() && <div id="icon_btn" onClick={toggleChildren} style={{ display: 'flex', alignContent: 'center' }}>
                        <MaterialIcon icon={'arrow_drop_down'} style={{ color: is_selected === true && 'var(--dark-color)' }} />
                    </div>}
                    <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 10, display: 'flex' }}>
                        <MaterialIcon
                            icon={quest.status === Status.INITIAL ? "circle" : (quest.status === Status.DONE ? "check_circle" : "block")}
                            style={{ color: quest.status === Status.DONE ? 'var(--completed-color)' : (is_selected == true && 'var(--dark-color)') }} />
                        <div className='font-base' style={{ color: is_selected == true && 'var(--dark-color)' }}>{quest.title}</div>
                    </div>
                </div>
            </div>
            {quest.hasSubquests() && isExpanded && (
                <div className='quest-list' style={{ paddingLeft: `${(quest.hasParent() && indent_witdh - 5)}px`, }} >
                    {children}
                </div>)
            }
        </div>
    )
}

export const NewQuestPopup = ({ isOpen, onClose, createNew }) => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [owner, setOwner] = useState('');
    const [editor, setEditor] = useState('');

    
    const handleChange = (setter) => (event) => {
        setter(event.target.value);
    };
    
    const handleCreate = () => {
        if (createNew(new Quest(0, title, desc, Status.INITIAL, null, Number(owner), Number(editor))))
            onClose();
        else {
            alert("invalid input")
        }
    };
    
    if (!isOpen) return null;
    return (
        <div className="popup-background" onClick={onClose}>
            <div className="listing-vertical popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="font-heading-2" style={{ textAlign: 'left' }}>New Quest</div>
                <div className="labled-text-field">
                    <BasicLable text="Title" id_="DescriptionInput" />
                    <BasicTextField id_="NewQPopTitleIn" text={title} onChange={(_, value) => setTitle(value)} />
                </div>
                <div className="labled-text-field">
                    <BasicLable text="Description" id_="DescriptionInput" />
                    <LongTextField id_="NewQPopDescIn" text={desc} onChange={(_, value) => setDesc(value)} />
                </div>
                <div className="labled-text-field">
                    <BasicLable text="Owner" id_="DescriptionInput" />
                    <BasicTextField id_="NewQPopOwnerIn" text={owner} onChange={(_, value) => setOwner(value)} />
                </div>
                <div className="labled-text-field">
                    <BasicLable text="Editor" id_="DescriptionInput" />
                    <BasicTextField id_="NewQPopEditorIn" text={editor} onChange={(_, value) => setEditor(value)} />
                </div>
                <div style={{ paddingTop: 30, alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center', gap: 20, display: 'inline-flex' }}>
                    <BasicTextButton text="Cancel" id_="NewQPopCancelBtn" onClick={onClose} />
                    <BasicTextButton text="Create" id_="NewQPopCreatelBtn" onClick={handleCreate} />
                </div>
            </div>
        </div>
    );
};

export const SidebarOption = ({ text, icon = 'add', id_, onClick }) => {
    return (
        <div className='sidebar-option' onClick={onClick} {...(id_ ? { id: id_ } : {})}>
            {MaterialIcon({ icon })}
            <div className="font-heading-3">{text}</div>
        </div>
    )
}

export const BasicTextField = ({ text, font_size = 14, padding_hor = 10, padding_vert = 10, id_, onChange }) => {
    const [content, setContent] = useState(text);

    const handleChange = (event) => {
        const newValue = event.target.value;
        setContent(newValue);
        onChange?.(id_, newValue);
    };

    return (
        <div className="text-field" style={{ paddingLeft: padding_hor, paddingRight: padding_hor, paddingTop: padding_vert, paddingBottom: padding_vert }}>
            <input type="text" className="font-base input" value={content} style={{ fontSize: font_size }} {...(id_ ? { id: id_ } : {})} onChange={handleChange} />
        </div>
    );
};

export const LongTextField = ({ text, font_size = 14, padding_hor = 10, padding_vert = 10, id_, onChange }) => {
    const textareaRef = useRef(null);
    const [content, setContent] = useState(text);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    const inputChanged = (event) => {
        const newValue = event.target.value;
        setContent(newValue);
        adjustHeight();
        onChange?.(id_, newValue);
    };

    return (
        <div className="text-field" style={{ paddingLeft: padding_hor, paddingRight: padding_hor, paddingTop: padding_vert, paddingBottom: padding_vert, }} >
            <textarea ref={textareaRef} className="font-base input" onChange={inputChanged} defaultValue={text}
                style={{ fontSize: font_size, width: '100%', resize: 'none', overflow: 'hidden', minHeight: '40px', }} {...(id_ ? { id: id_ } : {})}
            />
        </div>
    );
};

export const BasicLable = ({ text }) => {
    return (
        <div className="font-base">{text}:</div>
    )
}

export const IconTextButtonFill = ({ text, icon = 'add', onClick, content_alignment = 'flex-start', id_ }) => {
    return (
        <div className="button-icon-text-fill" style={{ justifyContent: content_alignment }} onClick={onClick} {...(id_ ? { id: id_ } : {})}>
            {MaterialIcon({ icon })}
            <div className="font-base">{text}</div>
        </div>
    )
}

export const IconTextButtonOutline = ({ text, icon = 'add', onClick, content_alignment = 'flex-start', id_ }) => {
    return (
        <div className="button-icon-text-outline" style={{ justifyContent: content_alignment }} onClick={onClick} {...(id_ ? { id: id_ } : {})}>
            {MaterialIcon({ icon })}
            <div className="font-base">{text}</div>
        </div>
    )
}

export const BasicTextButton = ({ text, content_alignment = 'center', onClick, id_ }) => {
    return (
        <div className="text-button" style={{ aligment: content_alignment }} onClick={onClick} {...(id_ ? { id: id_ } : {})}>
            <div className="font-base">{text}</div>
        </div>
    )
}

export const MaterialIcon = ({ icon, style = {} }) => {
    return (
        <span className="material-symbols-rounded" style={style}>{icon}</span>
    )
}

export const SimpleDivider = () => {
    return (
        <div className="divider" />
    )
}

