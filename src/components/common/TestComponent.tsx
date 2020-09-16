import React, { Component, useState, Fragment } from 'react';

const TestComponent = (props: any) => {
    const [index, setIndex] = useState(props.index);
    const [targetBox, setTargetBox] = useState<boolean | null>(null);

    const cssGrid: { [key: number]: string } = {
        1: "one",
        2: "two",
        3: "three",
        4: "four",
        5: "five",
        6: "six"
    }

    const dragEnd = (event: any) => {
        setTargetBox(null);
    }

    const dragStart = (event: any) => {
        event.dataTransfer.setData("text", event.target.id)
        setTargetBox(true);
    }

    const drop = (event: any) => {
        if (event.target.id) {
            props.swap(event.dataTransfer.getData("text"), event.target.id)
            event.dataTransfer.clearData()
        }
    }

    return (
        <div
            className={cssGrid[index]}
            id={props.title}
            draggable="true"
            onDrop={drop}
            onDragStart={dragStart}
            onDragOver={(event) => event.preventDefault()}
            onDragEnd={dragEnd} >
            {
                !targetBox ?
                    <Fragment>
                        <h3>{props.title}</h3>
                        <p>{props.details}</p>
                    </Fragment>
                    :
                    <Fragment />
            }
        </div>
    )
}

export default TestComponent