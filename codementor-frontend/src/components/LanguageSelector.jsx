import { Select, Typography } from "antd";

const { Text } = Typography;

function LanguageSelector({
    targetLanguage,
    onLanguageChange
}) {

    return (
        <div>
            <Text strong>
                Explanation Language
            </Text>

            <Select
                value={targetLanguage}
                onChange={onLanguageChange}
                style={{
                    width: "100%",
                    marginTop: 8
                }}
                options={[
                    {
                        value: "English",
                        label: "English"
                    },
                    {
                        value: "Malayalam",
                        label: "Malayalam"
                    },
                    {
                        value: "Tamil",
                        label: "Tamil"
                    },
                    {
                        value: "Hindi",
                        label: "Hindi"
                    },
                     {
                        value: "Hinglish",
                        label: "Hinglish"
                    },
                    {
                        value: "Bengali",
                        label: "Bengali"
                    },
                    {
                        value: "Telugu",
                        label: "Telugu"
                    },
                ]}
            />
        </div>
    );
}

export default LanguageSelector;