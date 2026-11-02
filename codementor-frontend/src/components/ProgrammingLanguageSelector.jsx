import { Select, Typography } from "antd";

const { Text } = Typography;

function ProgrammingLanguageSelector({
    language,
    onLanguageChange
}) {

    return (
        <div>
            <Text strong>
                Programming Language
            </Text>

            <Select
                value={language}
                onChange={onLanguageChange}
                style={{
                    width: "100%",
                    marginTop: 8
                }}
                options={[
                    {
                        value: "Java",
                        label: "☕ Java"
                    },
                    {
                        value: "Python",
                        label: "🐍 Python"
                    },
                    {
                        value: "JavaScript",
                        label: "🟨 JavaScript"
                    },
                    {
                        value: "C",
                        label: "🔵 C"
                    },
                    {
                        value: "C++",
                        label: "⚙️ C++"
                    },
                    {
                        value: "C#",
                        label: "🟣 C#"
                    },
                    {
                        value: "HTML",
                        label: "🌐 HTML"
                    },
                    {
                        value: "CSS",
                        label: "🎨 CSS"
                    },
                    {
                        value: "SQL",
                        label: "🗄️ SQL"
                    }
                ]}
            />
        </div>
    );
}

export default ProgrammingLanguageSelector;