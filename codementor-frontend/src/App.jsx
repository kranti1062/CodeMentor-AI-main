import { useState } from "react";

import {
    Button,
    Card,
    Typography,
    Tag,
    Space,
    message
} from "antd";

import {
    BugOutlined,
    RobotOutlined,
    SendOutlined,
    CodeOutlined,
    TranslationOutlined,
    FileTextOutlined,
    ArrowLeftOutlined,
    MailOutlined
} from "@ant-design/icons";

import { explainError } from "./services/api";

import ErrorInput from "./components/ErrorInput";
import LanguageSelector from "./components/LanguageSelector";
import ProgrammingLanguageSelector from "./components/ProgrammingLanguageSelector";

import ResumeMaker from "./components/resume/ResumeMaker";
import CoverLetterMaker from "./components/coverletter/CoverLetterMaker";

import "./App.css";

const { Title, Paragraph, Text } = Typography;

function App() {

    // ==========================================
    // CODEMENTOR AI STATE
    // ==========================================

    const [error, setError] = useState("");

    const [language, setLanguage] = useState("Java");

    const [targetLanguage, setTargetLanguage] =
        useState("Malayalam");

    const [result, setResult] = useState(null);

    const [loading, setLoading] = useState(false);


    // ==========================================
    // RESUME MAKER STATE
    // ==========================================

    const [showResumeMaker, setShowResumeMaker] =
        useState(false);


    // ==========================================
    // COVER LETTER MAKER STATE
    // ==========================================

    const [showCoverLetterMaker, setShowCoverLetterMaker] =
        useState(false);


    // ==========================================
    // CODE ERROR EXPLANATION
    // ==========================================

    const handleExplain = async () => {

        if (!error.trim()) {

            message.warning(
                "Please enter a programming error first."
            );

            return;
        }

        setLoading(true);

        setResult(null);

        try {

            const data = await explainError(
                error,
                language,
                targetLanguage
            );

            setResult(data);

            message.success(
                "AI explanation generated successfully!"
            );

        } catch (err) {

            console.error(err);

            message.error(
                "Could not connect to CodeMentor AI."
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // AI RESUME MAKER PAGE
    // ==========================================

    if (showResumeMaker) {

        return (
            <div
                style={{
                    minHeight: "100vh",
                    background: "#f5f7fb"
                }}
            >

                <div
                    style={{
                        padding: "20px 30px",
                        background: "#ffffff",
                        borderBottom:
                            "1px solid #e8e8e8",
                        position: "sticky",
                        top: 0,
                        zIndex: 1000
                    }}
                >

                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() =>
                            setShowResumeMaker(false)
                        }
                    >
                        Back to CodeMentor AI
                    </Button>

                </div>

                <ResumeMaker />

            </div>
        );
    }


    // ==========================================
    // AI COVER LETTER MAKER PAGE
    // ==========================================

    if (showCoverLetterMaker) {

        return (
            <div
                style={{
                    minHeight: "100vh",
                    background: "#f5f7fb"
                }}
            >

                <div
                    style={{
                        padding: "20px 30px",
                        background: "#ffffff",
                        borderBottom:
                            "1px solid #e8e8e8",
                        position: "sticky",
                        top: 0,
                        zIndex: 1000
                    }}
                >

                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() =>
                            setShowCoverLetterMaker(false)
                        }
                    >
                        Back to CodeMentor AI
                    </Button>

                </div>

                <CoverLetterMaker />

            </div>
        );
    }


    // ==========================================
    // MAIN CODEMENTOR AI WEBSITE
    // ==========================================

    return (

        <div className="app-container">

            {/* BACKGROUND */}

            <div className="glow glow-one" />

            <div className="glow glow-two" />


            {/* HEADER */}

            <header className="header">

                <div className="brand">

                    <div className="logo">
                        <RobotOutlined />
                    </div>

                    <div>

                        <Title
                            level={3}
                            className="brand-title"
                        >
                            CodeMentor AI
                        </Title>

                        <Text className="brand-subtitle">
                            Understand code. Fix errors
                            Learn better.
                        </Text>

                    </div>

                </div>


                {/* HEADER ACTIONS */}

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        flexWrap: "wrap"
                    }}
                >


                    {/* RESUME MAKER */}

                    <Button
    type="primary"
    icon={<FileTextOutlined />}
    onClick={() => {

        console.log(
            "Opening AI Resume Maker..."
        );

        setShowResumeMaker(true);

    }}
    className="header-resume-btn"
>
    AI Resume Maker
</Button>


                    {/* COVER LETTER */}

   <Button
    icon={<MailOutlined />}
    onClick={() => {
        console.log(
            "Opening AI Cover Letter Maker..."
        );

        setShowCoverLetterMaker(true);
    }}
    className="header-cover-btn"
>
    AI Cover Letter
</Button>

                </div>

            </header>


            {/* MAIN CONTENT */}

            <main className="main-content">


                {/* HERO */}

                <section className="hero">

                    <div className="hero-badge">

                        <BugOutlined />

                        AI Programming Assistant

                    </div>


                    <Title className="hero-title">

                        Turn confusing errors

                        <br />

                        into <span>
                            clear explanations.
                        </span>

                    </Title>


                    <Paragraph className="hero-description">

                        Paste your programming error and let
                        CodeMentor AI explain what happened,
                        why it happened, and how to fix it
                        in your preferred language.

                    </Paragraph>

                </section>


                {/* ERROR ANALYZER */}

                <Card
                    className="glass-card input-card"
                    variant={false}
                >

                    <div className="section-heading">

                        <div className="section-icon">

                            <CodeOutlined />

                        </div>


                        <div>

                            <Title level={4}>
                                Analyze Your Error
                            </Title>

                            <Text type="secondary">
                                Paste the error message below.
                            </Text>

                        </div>

                    </div>


                    <ErrorInput
                        value={error}
                        onChange={setError}
                    />


                    <div className="options-row">

                        <ProgrammingLanguageSelector
                            language={language}
                            onLanguageChange={
                                setLanguage
                            }
                        />


                        <LanguageSelector
                            targetLanguage={
                                targetLanguage
                            }
                            onLanguageChange={
                                setTargetLanguage
                            }
                        />

                    </div>


                    <Button
                        type="primary"
                        size="large"
                        icon={<SendOutlined />}
                        loading={loading}
                        onClick={handleExplain}
                        className="analyze-button"
                    >

                        {loading
                            ? "Analyzing Error..."
                            : "Explain This Error"}

                    </Button>

                </Card>


                {/* AI RESULT */}

                {result && (

                    <Card
                        className="glass-card result-card"
                        bordered={false}
                    >

                        <div className="result-header">

                            <div>

                                <Tag color="blue">

                                    <RobotOutlined />

                                    {" "}AI Analysis

                                </Tag>


                                <Title level={3}>
                                    Here's what happened
                                </Title>

                            </div>


                            <Tag color="green">

                                {targetLanguage}

                            </Tag>

                        </div>


                        <ResultSection
                            icon="💡"
                            title="Explanation"
                            content={
                                result.explanation
                            }
                        />


                        <ResultSection
                            icon="🔍"
                            title="Why It Happened"
                            content={
                                result.whyItHappened
                            }
                        />


                        <ResultSection
                            icon="🛠️"
                            title="How To Fix"
                            content={
                                result.howToFix
                            }
                        />


                        <div className="code-section">

                            <div className="code-header">

                                <Space>

                                    <CodeOutlined />

                                    <Text strong>
                                        Example
                                    </Text>

                                </Space>


                                <Tag>
                                    {language}
                                </Tag>

                            </div>


                            <pre className="code-block">

                                <code>
                                    {result.example}
                                </code>

                            </pre>

                        </div>

                    </Card>

                )}

            </main>


            {/* FOOTER */}

            <footer className="footer">

                <TranslationOutlined />

                <span>
                    CodeMentor AI — Learn programming
                    in your language.
                </span>

            </footer>

        </div>
    );
}


// ==========================================
// RESULT SECTION
// ==========================================

function ResultSection({
    icon,
    title,
    content
}) {

    return (

        <div className="explanation-section">

            <div className="result-icon">
                {icon}
            </div>


            <div>

                <Title level={4}>
                    {title}
                </Title>


                <Paragraph>
                    {content}
                </Paragraph>

            </div>

        </div>
    );
}


export default App;