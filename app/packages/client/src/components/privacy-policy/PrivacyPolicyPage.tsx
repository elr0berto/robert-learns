import React from 'react';
import {Col, Container, Row} from "react-bootstrap";

function PrivacyPolicyPage() {
    return <Container className={'mt-3'}>
        <Row>
            <Col>
                <h1>Privacy Policy</h1>
                <p>Effective Date: October 19, 2024</p>
                <p>
                    Welcome to Robert Learns! Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our application.
                </p>

                <h2>1. Information We Collect</h2>
                <p>
                    We collect personal information that you provide to us directly, such as your name, email address, and any other information you may submit while using Robert Learns. We also collect usage data to improve the application experience.
                </p>

                <h2>2. How We Use Your Information</h2>
                <p>
                    The information we collect is used to:
                </p>
                <ul>
                    <li>Provide, maintain, and improve our services.</li>
                    <li>Respond to user inquiries and support requests.</li>
                    <li>Personalize your experience with Robert Learns.</li>
                    <li>Comply with legal obligations.</li>
                </ul>

                <h2>3. Sharing of Information</h2>
                <p>
                    We do not sell or share your personal information with third parties, except as necessary to operate the app or comply with legal requirements.
                </p>

                <h2>4. Security</h2>
                <p>
                    We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, or disclosure.
                </p>

                <h2>5. Your Rights</h2>
                <p>
                    You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at support@robertlearns.com.
                </p>

                <h2>6. Changes to This Policy</h2>
                <p>
                    We may update this Privacy Policy from time to time. Any changes will be communicated on this page.
                </p>

                <h2>Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at robert@robertlearns.com.
                </p>
            </Col>
        </Row>
    </Container>;
}

export default PrivacyPolicyPage;