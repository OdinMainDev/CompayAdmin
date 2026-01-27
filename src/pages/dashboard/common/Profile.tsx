import { Button, Card, Col, Form, Row } from "react-bootstrap";

import TwofaSidebar from "@/components/dashboard/sidebars/2fa";
import PageHeader from "@/components/dashboard/common/PageHeader";

export default function Profile() {



  return (
    <Row>
      <PageHeader title="Profile" />

      <TwofaSidebar />

      <Col>
        <Card border="light" className="bg-white shadow-sm mb-4">
              <Card.Body>
                <Form>
                  <Row>
                    <h5 className="mb-4">Изменить Username</h5>
                    <Col md={6} className="mb-3">
                      <Form.Group id="firstName">
                        <Form.Label>Old Username</Form.Label>
                        <Form.Control required type="text" placeholder="Enter old username" />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group id="lastName">
                        <Form.Label>New Username</Form.Label>
                        <Form.Control required type="text" placeholder="Enter new username" />
                      </Form.Group>
                    </Col>
                    <h5 className="mb-4">Изменить Password</h5>
                    
                    <div className="col col-12">
                      <div className="position-relative">
                        <hr className="bg-body-secondary mb-4 mt-5" />
                        <div className="divider-content-center">Аккаунт администратора:</div>
                      </div>
                    </div>
                    <Col md={6} className="mb-3">
                      <Form.Group id="firstName">
                        <Form.Label>Old Username</Form.Label>
                        <Form.Control required type="text" placeholder="Enter old username" />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group id="lastName">
                        <Form.Label>New Username</Form.Label>
                        <Form.Control required type="text" placeholder="Enter new username" />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="mt-3 text-end">
                    <Button variant="primary" type="submit">Submit</Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
      </Col>
    </Row>
  )
}



