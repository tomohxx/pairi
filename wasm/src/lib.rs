use serde::Serialize;
use shanten_dp::{Data, Mode};
use std::cmp::Reverse;
use wasm_bindgen::prelude::*;

type Hand = [u8; 34];
type TileLimits = [u8; 35];

fn hand_from_slice(hand: &[u8]) -> Result<Hand, JsError> {
    hand.try_into().map_err(|_| JsError::new("hand must be an Uint8Array with length 34"))
}

fn tile_limits_from_slice(tile_limits: &[u8]) -> Result<TileLimits, JsError> {
    tile_limits
        .try_into()
        .map_err(|_| JsError::new("tile_limits must be an Uint8Array with length 35"))
}

fn discard(hand: &Hand, tid: usize) -> Result<Hand, JsError> {
    let mut clone = hand.clone();

    clone[tid] = clone[tid]
        .checked_sub(1)
        .ok_or_else(|| JsError::new("Cannot discard because tile count is already zero"))?;
    Ok(clone)
}

fn calc_shanten2(
    hand: &Hand,
    tile_limits: &TileLimits,
    m: usize,
    mode: Mode,
    four_tile_seven_pairs: bool,
    check_hand: bool,
) -> Result<Data, JsError> {
    shanten_dp::calc_shanten2(hand, tile_limits, m, mode, four_tile_seven_pairs, check_hand)
        .map_err(|error| JsError::new(&error.to_string()))?
        .ok_or_else(|| JsError::new("No shanten data found"))
}

fn tile_ids_from_mask(mask: u64) -> impl Iterator<Item = usize> {
    (0..34).filter(move |&tid| (mask & (1u64 << tid)) != 0)
}

#[derive(Serialize)]
struct JsPairiData(i8, Vec<(usize, u32, Vec<usize>)>);

#[wasm_bindgen(js_name = calcPairi)]
pub fn calc_pairi_wasm(
    hand: &[u8],
    tile_limits: &[u8],
    m: usize,
    four_tile_seven_pairs: bool,
    check_hand: bool,
) -> Result<JsValue, JsError> {
    let hand = hand_from_slice(hand)?;
    let tile_limits = tile_limits_from_slice(tile_limits)?;
    let data =
        calc_shanten2(&hand, &tile_limits, m, Mode::all(), four_tile_seven_pairs, check_hand)?;
    let tile_ids = tile_ids_from_mask(data.discards);
    let mut result = JsPairiData(data.shanten, Vec::new());

    for tid in tile_ids {
        let hand = discard(&hand, tid)?;
        let data =
            calc_shanten2(&hand, &tile_limits, m, Mode::all(), four_tile_seven_pairs, check_hand)?;
        let tile_ids: Vec<usize> = tile_ids_from_mask(data.waits).collect();
        let entry = (
            tid,
            tile_ids.iter().map(|&tid| (tile_limits[tid] - hand[tid]) as u32).sum(),
            tile_ids,
        );

        result.1.push(entry);
    }

    result.1.sort_by_key(|entry| Reverse(entry.1));

    serde_wasm_bindgen::to_value(&result).map_err(|error| JsError::new(&error.to_string()))
}
