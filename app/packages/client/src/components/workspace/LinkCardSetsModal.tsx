import {Button, Form, ListGroup, Modal} from "react-bootstrap";
import React from "react";
import {useActions, useAppState} from "../../overmind";
import {CardSetWithChildrenAndCardCounts} from "../../overmind/data/data-state";
import Loading from "../Loading";

type CardSetItemProps = {
    item: CardSetWithChildrenAndCardCounts;
    onClick: (cardSetId: number) => void;
    parentChecked: boolean;
}
function CardSetItem(props: CardSetItemProps) {
    const state = useAppState();
    const thisCardSet = state.linkCardSetsModal.cardSetId === props.item.cardSet.id;

    const checked = state.linkCardSetsModal.selectedCardSetIds.includes(props.item.cardSet.id) || props.parentChecked;
    return (
        <ListGroup.Item>
            <Form.Check
                type="checkbox"
                id={props.item.cardSet.id.toString()}
                label={props.item.cardSet.name + (thisCardSet ? ' (this card set)' : '')}
                disabled={state.linkCardSetsModal.disabled || thisCardSet || props.parentChecked || state.linkCardSetsModal.parentCardSetIds.includes(props.item.cardSet.id)}
                checked={checked}
                onChange={() => props.onClick(props.item.cardSet.id)}
            />
            {props.item.children.length > 0 && (
                <ListGroup className="mt-2">
                    {props.item.children.map(child => (
                        <CardSetItem
                            key={child.cardSet.id}
                            item={child}
                            onClick={props.onClick}
                            parentChecked={checked}
                        />
                    ))}
                </ListGroup>
            )}
        </ListGroup.Item>
    );
}

function LinkCardSetsModal() {
    const state = useAppState();
    const actions = useActions();

    if (!state.linkCardSetsModal.open) {
        return null;
    }

    const onHide = () => {
        if (!state.linkCardSetsModal.disabled) {
            actions.linkCardSetsModal.close();
        }
    }
    return <Modal show={true} onHide={onHide}>
        <Modal.Header closeButton>
            <Modal.Title>Link card sets to {state.page.cardSet?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {state.linkCardSetsModal.loading ?
                <Loading/> :
                <ListGroup>
                    {state.data.cardSetsWithChildrenAndCardCounts.map(item => {
                        return <CardSetItem
                            key={item.cardSet.id}
                            item={item}
                            onClick={actions.linkCardSetsModal.toggleCardSetId}
                            parentChecked={false}
                        />
                    })}
                </ListGroup>
            }
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onHide} disabled={state.linkCardSetsModal.disabled}>
                Cancel
            </Button>
            <Button variant="primary" onClick={() => actions.linkCardSetsModal.save()} disabled={state.linkCardSetsModal.disabled || !state.linkCardSetsModal.hasChanges}>
                {!state.linkCardSetsModal.hasChanges ? 'No changes...' : 'Save changes'}
            </Button>
        </Modal.Footer>
    </Modal>
}

export default LinkCardSetsModal;