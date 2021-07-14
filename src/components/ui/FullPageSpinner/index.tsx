import { EuiLoadingSpinner } from "@elastic/eui";

import { Container } from "./styles";

export function FullPageSpinner() {
  return (
    <Container>
      <EuiLoadingSpinner size="xl" />
    </Container>
  );
}
