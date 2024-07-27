import {useActions, useAppState} from "../../overmind";
import {Button, Container, Table} from "react-bootstrap";
import React from "react";
import JsonView from 'react18-json-view'
import 'react18-json-view/src/style.css'
// If dark mode is needed, import `dark.css`.
import 'react18-json-view/src/dark.css'
import Loading from "../Loading";
function AdminLogsPage() {
    const state = useAppState();
    const actions = useActions();

    if (state.adminLogsPage.loading) {
        return <Container><Loading/></Container>;
    }
    return <Container>
        <h1 className="my-5">Logs</h1>
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>ID</th>
                <th>Timestamp</th>
                <th>Level</th>
                <th>Message</th>
                <th>Meta</th>
            </tr>
            </thead>
            <tbody>
            {state.adminLogsPage.logEntries.map(entry => (
                <tr key={entry.id}>
                    <td>{entry.id}</td>
                    <td>{entry.timestamp}</td>
                    <td>{entry.level}</td>
                    <td>{entry.message}</td>
                    <td>{entry.meta ? <JsonView src={JSON.parse(entry.meta)}/> : null}</td>
                </tr>
            ))}
            </tbody>
        </Table>
        <Button onClick={() => actions.adminLogsPage.loadMore()}>{state.adminLogsPage.loading ? "Loading..." : "Load more..."}</Button>
    </Container>;
}

export default AdminLogsPage;