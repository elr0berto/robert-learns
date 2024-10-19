import React from 'react';
import {Col, Container, Row} from "react-bootstrap";

function TermsOfServicePage() {
    return <Container className={'mt-3'}>
        <Row>
            <Col>
                <h1>Terms of Service</h1>
                <p>Effective Date: October 19, 2024</p>
                <p>
                    Welcome to Robert Learns! By accessing or using our application, you agree to be bound by these
                    Terms of Service. If you do not agree with any part of these terms, you should not use the app.
                </p>

                <h2>1. Use of the Application</h2>
                <p>
                    Robert Learns grants you a non-exclusive, non-transferable, limited license to use the app for your
                    personal, non-commercial use. You agree to use the app in compliance with all applicable laws and
                    regulations.
                </p>

                <h2>2. User Accounts</h2>
                <p>
                    You may need to create an account to access certain features of Robert Learns. You are responsible
                    for maintaining the confidentiality of your account credentials and for any activity that occurs
                    under your account.
                </p>

                <h2>3. User Content</h2>
                <p>
                    You retain ownership of any content you submit, post, or display on or through the app. By
                    submitting content, you grant Robert Learns a worldwide, non-exclusive, royalty-free license to use,
                    display, and distribute your content in connection with operating and providing the app.
                </p>

                <h2>4. Prohibited Activities</h2>
                <p>
                    You agree not to:
                </p>
                <ul>
                    <li>Use the app for any illegal or unauthorized purpose.</li>
                    <li>Access, tamper with, or use non-public areas of the app.</li>
                    <li>Upload, post, or transmit any content that is harmful, offensive, or violates any laws.</li>
                </ul>

                <h2>5. Intellectual Property</h2>
                <p>
                    All content, trademarks, logos, and other intellectual property on Robert Learns are owned by or
                    licensed to us. You agree not to reproduce, distribute, or create derivative works without our
                    express permission.
                </p>

                <h2>6. Disclaimer of Warranties</h2>
                <p>
                    The app is provided "as is" without warranties of any kind. We do not guarantee that the app will be
                    error-free, secure, or available at all times.
                </p>

                <h2>7. Limitation of Liability</h2>
                <p>
                    To the fullest extent permitted by law, Robert Learns will not be liable for any indirect,
                    incidental, or consequential damages arising from your use of the app.
                </p>

                <h2>8. Termination</h2>
                <p>
                    We reserve the right to suspend or terminate your access to Robert Learns at our discretion, without
                    notice, if you violate these terms or engage in prohibited activities.
                </p>

                <h2>9. Changes to Terms</h2>
                <p>
                    We may update these Terms of Service from time to time. Any changes will be effective when posted on
                    this page. Your continued use of the app after the changes will indicate your acceptance of the new
                    terms.
                </p>

                <h2>10. Governing Law</h2>
                <p>
                    These terms will be governed by and construed in accordance with the laws of Thailand, without regard to its conflict of laws principles.
                </p>

                <h2>Contact Us</h2>
                <p>
                    If you have any questions or concerns about these Terms of Service, please contact us at robert@robertlearns.com.
                </p>
            </Col>
        </Row>
    </Container>;
}

export default TermsOfServicePage;