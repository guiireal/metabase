import _userEvent from "@testing-library/user-event";

import { renderWithProviders, screen } from "__support__/ui";

import { SimpleSingleDatePicker } from "./SimpleSingleDatePicker";

const DATE = new Date(2020, 0, 10);
const DATE_TIME = new Date(2020, 0, 10, 10, 20);

interface SetupOpts {
  value?: Date;
}

const userEvent = _userEvent.setup({
  advanceTimers: jest.advanceTimersByTime,
});

function setup({ value = DATE }: SetupOpts = {}) {
  const onChange = jest.fn();

  renderWithProviders(
    <SimpleSingleDatePicker value={value} onChange={onChange} />,
  );

  return { onChange };
}

describe("SimpleSingleDatePicker", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2020, 0, 15));
  });

  it("should be able to set the date via the calendar", async () => {
    const { onChange } = setup();

    await userEvent.click(screen.getByText("12"));

    expect(onChange).toHaveBeenCalledWith(new Date(2020, 0, 12));
  });

  it("should be able to set the date via the calendar when there is time", async () => {
    const { onChange } = setup({
      value: DATE_TIME,
    });

    await userEvent.click(screen.getByText("12"));

    expect(onChange).toHaveBeenCalledWith(new Date(2020, 0, 12, 10, 20));
  });

  it("should be able to set the date via the input", async () => {
    const { onChange } = setup();

    const input = screen.getByLabelText("Date");
    await userEvent.clear(input);
    await userEvent.type(input, "Feb 15, 2020");

    expect(screen.getByText("February 2020")).toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith(new Date(2020, 1, 15));
  });

  it("should be able to set the date via the input when there is time", async () => {
    const { onChange } = setup({
      value: DATE_TIME,
    });

    const input = screen.getByLabelText("Date");
    await userEvent.clear(input);
    await userEvent.type(input, "Feb 15, 2020");

    expect(screen.getByText("February 2020")).toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith(new Date(2020, 1, 15, 10, 20));
  });

  it("should be able to add time", async () => {
    const { onChange } = setup();

    await userEvent.click(screen.getByText("Add time"));
    const input = screen.getByLabelText("Time");
    await userEvent.clear(input);
    await userEvent.type(input, "10:20");

    expect(onChange).toHaveBeenLastCalledWith(new Date(2020, 0, 10, 10, 20));
  });

  it("should be able to update the time", async () => {
    const { onChange } = setup({
      value: DATE_TIME,
    });

    const input = screen.getByLabelText("Time");
    await userEvent.clear(input);
    await userEvent.type(input, "20:30");

    expect(onChange).toHaveBeenLastCalledWith(new Date(2020, 0, 10, 20, 30));
  });

  it("should be able to remove time", async () => {
    const { onChange } = setup({
      value: DATE_TIME,
    });

    await userEvent.click(screen.getByText("Remove time"));

    expect(screen.queryByLabelText("Time")).not.toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith(new Date(2020, 0, 10));
  });
});
