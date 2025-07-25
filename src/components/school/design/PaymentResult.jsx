import { Button, Result } from 'antd';

export default function PaymentResult() {
    return(
        <Result
            status="success"
            title="Successfully Paying for package!"
            subTitle="Amount: 10.000.000 Cloud server configuration takes 1-5 minutes, please wait."
            extra={[
                <Button type="primary" key="console">
                    Go Console
                </Button>,
                <Button key="buy">Buy Again</Button>,
            ]}
        />
    )
}