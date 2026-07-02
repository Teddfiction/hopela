import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export interface ReservationConfirmedStrings {
  preview: string;
  heading: string;
  greeting: string;
  body: string;
  viewList: string;
  cancelIntro: string;
  cancelLink: string;
  footer: string;
}

export interface ReservationConfirmedProps {
  strings: ReservationConfirmedStrings;
  listUrl: string;
  cancelUrl: string;
}

/**
 * Reservation confirmation email. All copy arrives translated via `strings`
 * (next-intl runs server-side, before render). Inline styles only — email
 * clients do not load the app design tokens.
 */
export function ReservationConfirmedEmail({
  strings,
  listUrl,
  cancelUrl,
}: ReservationConfirmedProps) {
  return (
    <Html>
      <Head />
      <Preview>{strings.preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>{strings.heading}</Heading>
          <Text style={styles.text}>{strings.greeting}</Text>
          <Text style={styles.text}>{strings.body}</Text>
          <Section style={styles.buttonSection}>
            <Button href={listUrl} style={styles.button}>
              {strings.viewList}
            </Button>
          </Section>
          <Hr style={styles.hr} />
          <Text style={styles.muted}>{strings.cancelIntro}</Text>
          <Text style={styles.muted}>
            <Link href={cancelUrl} style={styles.link}>
              {strings.cancelLink}
            </Link>
          </Text>
          <Hr style={styles.hr} />
          <Text style={styles.footer}>{strings.footer}</Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#faf9f7",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    padding: "24px 0",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    margin: "0 auto",
    maxWidth: "480px",
    padding: "32px",
  },
  heading: {
    color: "#1c1917",
    fontSize: "22px",
    lineHeight: "28px",
    margin: "0 0 16px",
  },
  text: {
    color: "#1c1917",
    fontSize: "15px",
    lineHeight: "24px",
    margin: "0 0 12px",
  },
  buttonSection: {
    margin: "24px 0",
    textAlign: "center" as const,
  },
  button: {
    backgroundColor: "#f5c518",
    borderRadius: "24px",
    color: "#713f12",
    display: "inline-block",
    fontSize: "15px",
    fontWeight: 600,
    padding: "12px 24px",
    textDecoration: "none",
  },
  hr: {
    borderColor: "#e7e5e4",
    margin: "20px 0",
  },
  muted: {
    color: "#78716c",
    fontSize: "13px",
    lineHeight: "20px",
    margin: "0 0 8px",
  },
  link: {
    color: "#78716c",
    textDecoration: "underline",
  },
  footer: {
    color: "#a8a29e",
    fontSize: "12px",
    lineHeight: "18px",
    margin: 0,
  },
} as const;
