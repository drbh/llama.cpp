type FirstNameLastName = [string, string];
type Result = {
    "country": string,
    "population": integer,
    "percent_retired": float,
    "head_of_state": FirstNameLastName | null,
};