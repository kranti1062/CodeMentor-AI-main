import { Input, Typography } from "antd";

const { TextArea } = Input;
const { Text } = Typography;

function ErrorInput({ value, onChange }) {

    return (
        <div>
            <Text strong>
                Paste your programming error
            </Text>

            <TextArea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Example: String cannot be converted to int"
                rows={7}
                style={{ marginTop: 8 }}
            />
        </div>
    );
}

export default ErrorInput;