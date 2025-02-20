import * as React from "react";
import { render, screen } from "@testing-library/react";

import Navigation from "@/app/_components/Navigation";

describe("Navigation", () => {
  it("render Navigation component", () => {
    render(<Navigation />);
    screen.debug();
  });
});
