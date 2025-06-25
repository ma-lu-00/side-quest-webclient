import React, { useState, useRef, useEffect } from 'react';
import './App.css';

export const QuestItem = ({ title = "NoTitle", status = 'initial', parent_quest, description = "NoDesc", id_, is_selected = false, onClick, children }) => {
    const has_children = children ? true : false;
    const indent_witdh = 46;

    const [isExpanded, setIsExpanded] = useState(false);
    const toggleChildren = () => {
        console.log(`toggle: ${isExpanded}`);
        setIsExpanded(prev => !prev);
    };

    return (
        <div className='quest-list'>
            <div style={{ width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 0, display: 'flex', boxSizing: 'border-box' }}
                {...(id_ ? { id: id_ } : {})}>
                {parent_quest && <MaterialIcon icon='subdirectory_arrow_right' style={{ paddingLeft: `${(parent_quest && indent_witdh / 2)}px`, }} />}
                <div className='quest-item' style={{ background: is_selected === true && 'var(--light-color)' }} onClick={onClick} >
                    {has_children && <div id="icon_btn" onClick={toggleChildren}>
                        <MaterialIcon icon={'arrow_drop_down'} style={{ color: is_selected === true && 'var(--dark-color)' }} />
                    </div>}
                    <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 10, display: 'flex' }}>
                        <MaterialIcon
                            icon={status === 'initial' ? "circle" : (status === 'done' ? "check_circle" : "block")}
                            style={{ color: status == 'done' ? 'var(--completed-color)' : (is_selected === true && 'var(--dark-color)') }} />
                        <div className='font-base' style={{ color: is_selected === true && 'var(--dark-color)' }}>{title}</div>
                    </div>
                </div>
            </div>
            {has_children && isExpanded && (
                <div className='quest-list' style={{ paddingLeft: `${(parent_quest && indent_witdh - 5)}px`, }} >
                    {children}
                </div>)
            }
        </div>
    )
}

export const NewQuestPopup = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="popup-background" onClick={onClose}>
            <div className="listing-vertical popup-content" onClick={(e) => e.stopPropagation()}>
                <div className='font-heading-2' style={{ textAlign: 'left' }}>New Quest</div>
                <div className='labled-text-field'>
                    <BasicLable text="Title" id_="DescriptionInput" />
                    <BasicTextField id_="NewQPopTitleIn" />
                </div>
                <div className='labled-text-field'>
                    <BasicLable text="Description" id_="DescriptionInput" />
                    <LongTextField id_="NewQPopDescIn" />
                </div>
                <div className='labled-text-field'>
                    <BasicLable text="Owner" id_="DescriptionInput" />
                    <BasicTextField id_="NewQPopOwnerIn" />
                </div>
                <div className='labled-text-field'>
                    <BasicLable text="Editor" id_="DescriptionInput" />
                    <BasicTextField id_="NewQPopEditorIn" />
                </div>
                <div style={{ paddingTop: 30, alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center', gap: 20, display: 'inline-flex' }}>
                    <BasicTextButton text="Cancel" id_="NewQPopCancelBtn" />
                    <BasicTextButton text="Create" id_="NewQPopCreatelBtn" />
                </div>
            </div>
        </div>
    )
}

export const SidebarOption = ({ text, icon = 'add', id_, onClick }) => {
    return (
        <div className='sidebar-option' onClick={onClick} {...(id_ ? { id: id_ } : {})}>
            {MaterialIcon({ icon })}
            <div className="font-heading-3">{text}</div>
        </div>
    )
}

export const BasicTextField = ({ text, font_size = 14, padding_hor = 10, padding_vert = 10, id_ }) => {
    return (
        <div className="text-field" style={{ paddingLeft: padding_hor, paddingRight: padding_hor, paddingTop: padding_vert, paddingBottom: padding_vert }}>
            <input type="text" className="font-base input" defaultValue={text} aria-multiline={true} style={{ fontSize: font_size }} {...(id_ ? { id: id_ } : {})} />
        </div>
    )
}

export const LongTextField = ({ text, font_size = 14, padding_hor = 10, padding_vert = 10, id_ }) => {
    const textareaRef = useRef(null);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [text]);

    return (
        <div className="text-field" style={{ paddingLeft: padding_hor, paddingRight: padding_hor, paddingTop: padding_vert, paddingBottom: padding_vert, }} >
            <textarea ref={textareaRef} className="font-base input"  onInput={adjustHeight}
                style={{ fontSize: font_size, width: '100%', resize: 'none', overflow: 'hidden', minHeight: '40px', }}
                {...(id_ ? { id: id_ } : {})}
            >{text}</textarea>
        </div>
    );
};

function auto_height(elem) {
    elem.style.height = '1px';
    elem.style.height = `${elem.scrollHeight}px`;
}

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

