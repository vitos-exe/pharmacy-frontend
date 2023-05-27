function OrderInfoDialog(props){
    function getTableRow(data, i){
        return (
            <tr key={i}>
                <td>{data.name}</td>
                <td>{data.quantity} units</td>
            </tr>
        );
    }

    return (
        <div className="order-details-dialog">
            <div className="dialog-top"></div>
            <table>
                <tbody>
                    {props.data.order_items.map((item, i) => getTableRow(item, i))}
                </tbody>
            </table>
            <button className="close-button" onClick={props.closeDialog}>Close</button>
        </div>
    );
}

export default OrderInfoDialog;