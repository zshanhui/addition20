use web_sys::{HtmlInputElement, InputEvent};
use yew::prelude::*;

const PROBLEM_COUNT: usize = 10;

#[derive(Clone, Copy, PartialEq, Eq)]
enum Mode {
    Addition,
    Subtraction,
    Mixed,
}

#[derive(Clone, Copy, PartialEq, Eq)]
enum Operator {
    Add,
    Subtract,
}

impl Operator {
    fn symbol(self) -> &'static str {
        match self {
            Self::Add => "+",
            Self::Subtract => "-",
        }
    }
}

#[derive(Clone, PartialEq, Eq)]
struct Problem {
    left: u32,
    right: u32,
    operator: Operator,
}

impl Problem {
    fn answer(&self) -> u32 {
        match self.operator {
            Operator::Add => self.left + self.right,
            Operator::Subtract => self.left - self.right,
        }
    }
}

#[derive(Clone, PartialEq, Eq)]
struct Hint {
    left: u32,
    right: u32,
    operator: Operator,
}

#[function_component(App)]
fn app() -> Html {
    let mode = use_state(|| Mode::Addition);
    let problems = use_state(Vec::<Problem>::new);
    let answers = use_state(|| vec![String::new(); PROBLEM_COUNT]);
    let results = use_state(|| vec![None::<bool>; PROBLEM_COUNT]);
    let rounds_won = use_state(|| 0_u32);
    let hint = use_state(|| None::<Hint>);

    let on_mode_change = {
        let mode = mode.clone();
        Callback::from(move |new_mode: Mode| mode.set(new_mode))
    };

    let on_generate = {
        let mode = mode.clone();
        let problems = problems.clone();
        let answers = answers.clone();
        let results = results.clone();
        let hint = hint.clone();

        Callback::from(move |_| {
            problems.set(generate_problems(*mode));
            answers.set(vec![String::new(); PROBLEM_COUNT]);
            results.set(vec![None; PROBLEM_COUNT]);
            hint.set(None);
        })
    };

    let on_check = {
        let answers = answers.clone();
        let problems = problems.clone();
        let results = results.clone();
        let rounds_won = rounds_won.clone();

        Callback::from(move |_| {
            if problems.len() != PROBLEM_COUNT {
                return;
            }

            let checked_results: Vec<Option<bool>> = problems
                .iter()
                .zip(answers.iter())
                .map(|(problem, answer)| {
                    answer
                        .trim()
                        .parse::<u32>()
                        .ok()
                        .map(|value| value == problem.answer())
                })
                .collect();

            let all_correct = checked_results.iter().all(|result| *result == Some(true));
            results.set(checked_results);

            if all_correct {
                rounds_won.set(*rounds_won + 1);
            }
        })
    };

    let background_class = match *rounds_won {
        0 => "round-zero",
        1 => "round-one",
        2 => "round-two",
        _ => "round-complete",
    };

    html! {
        <main class={classes!("app-shell", background_class)}>
            <section class="intro-card">
                <p class="version-text">{"Rust/Yew WASM rewrite of Addition20"}</p>
                <h1>{"Adding and subtracting from 1-20"}</h1>
                <p>{"Generate a set of problems, type your answers, and use hints to count with visual markers."}</p>

                <fieldset class="mode-controls">
                    <legend>{"Mode"}</legend>
                    <label>
                        <input
                            type="radio"
                            name="mode"
                            checked={*mode == Mode::Addition}
                            onchange={change_mode_callback(Mode::Addition, on_mode_change.clone())}
                        />
                        {" Addition"}
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="mode"
                            checked={*mode == Mode::Subtraction}
                            onchange={change_mode_callback(Mode::Subtraction, on_mode_change.clone())}
                        />
                        {" Subtraction"}
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="mode"
                            checked={*mode == Mode::Mixed}
                            onchange={change_mode_callback(Mode::Mixed, on_mode_change.clone())}
                        />
                        {" Mixed"}
                    </label>
                </fieldset>

                <button class="primary-button" onclick={on_generate}>{"Generate problems"}</button>
            </section>

            <section class="practice-card">
                <div class="practice-header">
                    <h2>{"Practice set"}</h2>
                    <button
                        class="secondary-button"
                        onclick={on_check}
                        disabled={problems.len() != PROBLEM_COUNT}
                    >
                        {"Check answers"}
                    </button>
                </div>

                if problems.is_empty() {
                    <p class="empty-state">{"Choose a mode and generate your first set of problems."}</p>
                } else {
                    <ol class="problem-list">
                        { for problems.iter().enumerate().map(|(index, problem)| {
                            let answers = answers.clone();
                            let answer_value = answers[index].clone();
                            let oninput = Callback::from(move |event: InputEvent| {
                                let input: HtmlInputElement = event.target_unchecked_into();
                                let mut next_answers = (*answers).clone();
                                next_answers[index] = input.value();
                                answers.set(next_answers);
                            });

                            let hint = hint.clone();
                            let problem_for_hint = problem.clone();
                            let show_hint = Callback::from(move |_| {
                                hint.set(Some(Hint {
                                    left: problem_for_hint.left,
                                    right: problem_for_hint.right,
                                    operator: problem_for_hint.operator,
                                }));
                            });

                            let result_class = match results[index] {
                                Some(true) => "answer-correct",
                                Some(false) => "answer-wrong",
                                None => "",
                            };

                            html! {
                                <li class="problem-row">
                                    <span class="problem-text">
                                        {format!("{} {} {} =", problem.left, problem.operator.symbol(), problem.right)}
                                    </span>
                                    <input
                                        class={classes!("answer-input", result_class)}
                                        inputmode="numeric"
                                        value={answer_value}
                                        {oninput}
                                        aria-label={format!("Answer for problem {}", index + 1)}
                                    />
                                    <button class="hint-button" onclick={show_hint}>{"hint"}</button>
                                    <span class="result-text">
                                        {
                                            match results[index] {
                                                Some(true) => "ok :-)",
                                                Some(false) => "try again",
                                                None => "",
                                            }
                                        }
                                    </span>
                                </li>
                            }
                        }) }
                    </ol>
                }
            </section>

            <section class="hint-card">
                <div class="hint-header">
                    <h2>{"Counting hint"}</h2>
                    <p>{format!("Rounds won: {}", *rounds_won)}</p>
                </div>

                { render_hint((*hint).clone()) }

                if *rounds_won >= 3 {
                    <div class="win-module">
                        <h3>{"Nice work! You completed all the math problems for today."}</h3>
                        <a href="https://www.youtube.com/results?search_query=excavator">{"to youtube"}</a>
                        <p>{"Refresh the page to practice some more maths."}</p>
                    </div>
                }
            </section>
        </main>
    }
}

fn change_mode_callback(mode: Mode, callback: Callback<Mode>) -> Callback<Event> {
    Callback::from(move |_| callback.emit(mode))
}

fn generate_problems(mode: Mode) -> Vec<Problem> {
    match mode {
        Mode::Addition => (0..PROBLEM_COUNT).map(|_| addition_problem()).collect(),
        Mode::Subtraction => (0..PROBLEM_COUNT).map(|_| subtraction_problem()).collect(),
        Mode::Mixed => (0..PROBLEM_COUNT)
            .map(|index| {
                if index % 2 == 0 {
                    addition_problem()
                } else {
                    subtraction_problem()
                }
            })
            .collect(),
    }
}

fn addition_problem() -> Problem {
    Problem {
        left: random_u32(12),
        right: random_u32(12),
        operator: Operator::Add,
    }
}

fn subtraction_problem() -> Problem {
    let first = random_u32(20);
    let second = random_u32(10);

    Problem {
        left: first.max(second),
        right: first.min(second),
        operator: Operator::Subtract,
    }
}

fn random_u32(max_inclusive: u32) -> u32 {
    (js_sys::Math::random() * f64::from(max_inclusive + 1)).floor() as u32
}

fn render_hint(hint: Option<Hint>) -> Html {
    match hint {
        Some(hint) => {
            let problem_text = format!("{} {} {} =", hint.left, hint.operator.symbol(), hint.right);
            html! {
                <>
                    <p class="hint-problem">{ problem_text }</p>
                    <div class={classes!("ball-stage", if hint.operator == Operator::Subtract { "subtract-stage" } else { "add-stage" })}>
                        { render_balls(&hint) }
                    </div>
                </>
            }
        }
        None => html! {
            <p class="empty-state">{"Use any problem's hint button to draw counting markers here."}</p>
        },
    }
}

fn render_balls(hint: &Hint) -> Html {
    match hint.operator {
        Operator::Add => html! {
            <>
                <div class="ball-group">
                    { for (1..=hint.left).map(|number| html! { <span class="ball">{ number }</span> }) }
                </div>
                <span class="large-operator">{"+"}</span>
                <div class="ball-group">
                    { for (1..=hint.right).map(|offset| html! { <span class="ball">{ hint.left + offset }</span> }) }
                </div>
                <span class="large-operator">{"= ?"}</span>
            </>
        },
        Operator::Subtract => html! {
            <>
                <div class="ball-group wide">
                    { for (1..=hint.left).map(|number| {
                        let removed = number > hint.left - hint.right;
                        html! {
                            <span class={classes!("ball", removed.then_some("removed-ball"))}>
                                { number }
                            </span>
                        }
                    }) }
                </div>
                <span class="large-operator">{"= ?"}</span>
            </>
        },
    }
}

fn main() {
    yew::Renderer::<App>::new().render();
}
