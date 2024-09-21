use cocoa::base::id;
use cocoa::foundation::{NSArray, NSString};
use core_foundation::string::CFString;
use objc::runtime::Object;
use std::ffi::CStr;

#[cfg(target_os = "macos")]
#[link(name = "CoreServices", kind = "framework")]
extern "C" {
    pub fn DCSGetActiveDictionaries() -> id;
    pub fn DCSDictionaryGetName(dictionary: *mut Object) -> id;
    pub fn DCSCopyRecordsForSearchString(
        dictionary: *mut Object,
        word: CFString,
        start: i32,
        offset: i32,
    ) -> id;
    pub fn DCSRecordCopyData(record: *mut Object) -> id;
}

#[cfg(target_os = "macos")]
pub fn lookup(word: &str) -> String {
    let search_term = CFString::new(word);
    // 获取激活的词典
    let avaliable_dicts = unsafe { DCSGetActiveDictionaries() };

    if avaliable_dicts.is_null() {
        return String::from("");
    }

    // 进行后续操作
    let length = unsafe { avaliable_dicts.count() };
    let mut selected_dict: *mut Object = std::ptr::null_mut();

    for i in 0..length {
        let dict = unsafe { avaliable_dicts.objectAtIndex(i) };
        let name_obj = unsafe { DCSDictionaryGetName(dict) };
        if name_obj.is_null() {
            continue;
        }
        let name = unsafe { name_obj.UTF8String() };
        let c_str: &CStr = unsafe { CStr::from_ptr(name) };
        let str_slice: &str = c_str.to_str().unwrap();
        let str_buf: String = str_slice.to_string();
        if str_buf == "牛津英汉汉英词典" {
            selected_dict = dict;
        }
    }

    if selected_dict.is_null() {
        return String::from("");
    }

    let records =
        unsafe { DCSCopyRecordsForSearchString(selected_dict, search_term.clone(), 0, 0) };
    if records.is_null() {
        return String::from("");
    }
    let records_len = unsafe { records.count() };

    let mut definition = String::new();
    for i in 0..records_len {
        let record = unsafe { records.objectAtIndex(i) };
        let def_objc_str = unsafe { DCSRecordCopyData(record) };
        if !def_objc_str.is_null() {
            let c_str: &CStr = unsafe { CStr::from_ptr(def_objc_str.UTF8String()) };
            let str_slice: &str = c_str.to_str().unwrap();
            let str_buf: String = str_slice.to_string(); // if necessary
            definition += &str_buf;
        }
    }

    return definition;
}


#[cfg(target_os = "macos")]
#[test]
fn test_lookup() {
    let result = lookup("hello");
    assert_eq!(result, "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n<html xmlns:d=\"http://www.apple.com/DTDs/DictionaryService-1.0.rng\"><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" /></head><body><d:entry id=\"e_DWS-001226\" d:title=\"hello\" class=\"entry\" lang=\"zh-cmn-Hans\" xml:lang=\"zh-cmn-Hans\"><span class=\"hwg x_xh0\"><span d:dhw=\"1\" role=\"text\" class=\"hw\">hello </span><span prxid=\"hello_gb_7b1b\" prlexid=\"optra0053619.001\" dialect=\"BrE\" class=\"prx\"><span class=\"gp tg_prx\"> | </span><span class=\"gp tg_prx\">BrE </span><span d:prn=\"UK_IPA\" soundFile=\"hello#_gb_1\" dialect=\"BrE\" class=\"ph\">həˈləʊ<d:prn></d:prn><span class=\"gp tg_ph\">, </span></span><span d:prn=\"UK_IPA\" soundFile=\"hello#_gb_2\" dialect=\"BrE\" class=\"ph\">hɛˈləʊ<d:prn></d:prn></span><span class=\"gp tg_prx\">, </span></span><span prxid=\"hello_us_7b26\" prlexid=\"optra0053619.002\" dialect=\"AmE\" class=\"prx\"><span class=\"gp tg_prx\">AmE </span><span d:prn=\"UK_IPA\" soundFile=\"hello#_us_1_rr\" dialect=\"AmE\" class=\"ph\">həˈloʊ<d:prn></d:prn><span class=\"gp tg_ph\">, </span></span><span d:prn=\"UK_IPA\" soundFile=\"hello#_us_2_rr\" dialect=\"AmE\" class=\"ph\">hɛˈloʊ<d:prn></d:prn></span><span class=\"gp tg_prx\"> | </span></span><span class=\"gp tg_hwg\"> </span></span><span lexid=\"b-en-zh_hans0016768.001\" class=\"gramb x_xd0 hasSn\"><span class=\"x_xdh\"><span class=\"gp sn ty_label tg_gramb\">A.</span><span class=\"gp tg_gramb\"> </span><span d:pos=\"1\" class=\"ps\">noun <d:pos></d:pos></span><span class=\"gp\">  </span></span><span lexid=\"b-en-zh_hans0016768.002\" class=\"semb x_xd1\"><span class=\"trg x_xd2\"><span d:def=\"1\" class=\"trans\">问候 <d:def></d:def></span><span class=\"trans ty_pinyin\">wènhòu </span></span></span></span><span lexid=\"b-en-zh_hans0016768.003\" class=\"gramb x_xd0 hasSn\"><span class=\"x_xdh\"><span class=\"gp sn ty_label tg_gramb\">B.</span><span class=\"gp tg_gramb\"> </span><span d:pos=\"2\" class=\"ps\">exclamation <d:pos></d:pos></span><span class=\"gp\">  </span></span><span id=\"e_DWS-001346\" lexid=\"b-en-zh_hans0016768.004\" class=\"semb x_xd1 hasSn\"><span class=\"gp x_xdh sn ty_label tg_semb\">① </span><span class=\"trgg x_xd2\"><span class=\"trg\"><span class=\"ind\"><span class=\"gp tg_ind\">(</span>greeting<span class=\"gp tg_ind\">) </span></span><span d:def=\"2\" class=\"trans\">你好 <d:def></d:def></span><span class=\"trans ty_pinyin\">nǐ hǎo</span><span class=\"gp tg_trg\">; </span></span><span class=\"trg\"><span class=\"ind\"><span class=\"gp tg_ind\">(</span>on phone<span class=\"gp tg_ind\">) </span></span><span class=\"trans\">喂 </span><span class=\"trans ty_pinyin\">wèi </span></span></span></span><span lexid=\"b-en-zh_hans0016768.005\" class=\"semb x_xd1 hasSn\"><span class=\"gp x_xdh sn ty_label tg_semb\">② </span><span class=\"trg x_xd2\"><span class=\"reg\">British </span><span class=\"ind\"><span class=\"gp tg_ind\">(</span>in surprise<span class=\"gp tg_ind\">) </span></span><span d:def=\"2\" class=\"trans\">嘿 <d:def></d:def></span><span class=\"trans ty_pinyin\">hēi </span></span></span></span></d:entry></body></html>\n");
}
